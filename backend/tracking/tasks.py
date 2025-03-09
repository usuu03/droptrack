import csv
import io
from celery import shared_task
from django.conf import settings
from ebaysdk.trading import Connection as Trading
from .models import TrackingConversion, BulkUpload

def get_ebay_api(auth_token):
    return Trading(
        appid=settings.EBAY_APP_ID,
        certid=settings.EBAY_CERT_ID,
        devid=settings.EBAY_DEV_ID,
        token=auth_token,
        config_file=None
    )

def detect_carrier(tracking_number):
    """
    Detect carrier based on tracking number format.
    This is a simple implementation and should be enhanced with more sophisticated logic.
    """
    if tracking_number.startswith('TBA'):
        return 'amzl'
    elif tracking_number.startswith('1Z'):
        return 'ups'
    elif len(tracking_number) == 22 and tracking_number.isalnum():
        return 'usps'
    elif len(tracking_number) == 12 and tracking_number.isdigit():
        return 'fedex'
    return 'other'

def convert_tracking_number(tracking_number, original_carrier):
    """
    Convert Amazon tracking number to carrier-specific format.
    This is a placeholder implementation and should be replaced with actual conversion logic.
    """
    # In a real implementation, this would use more sophisticated logic or external APIs
    # For now, we'll just return the original tracking number
    return tracking_number, original_carrier

@shared_task
def process_tracking_conversion(tracking_conversion_id):
    try:
        conversion = TrackingConversion.objects.get(id=tracking_conversion_id)
        conversion.status = 'processing'
        conversion.save()

        # Detect carrier from tracking number
        original_carrier = detect_carrier(conversion.amazon_tracking_number)
        
        # Convert tracking number
        converted_number, converted_carrier = convert_tracking_number(
            conversion.amazon_tracking_number,
            original_carrier
        )

        # Update eBay with new tracking info
        api = get_ebay_api(conversion.ebay_account.auth_token)
        api.execute('CompleteSale', {
            'OrderID': conversion.ebay_order_id,
            'Shipped': True,
            'Shipment': {
                'ShipmentTrackingDetails': {
                    'ShipmentTrackingNumber': converted_number,
                    'ShippingCarrierUsed': converted_carrier.upper()
                }
            }
        })

        # Update conversion record
        conversion.converted_tracking_number = converted_number
        conversion.converted_carrier = converted_carrier
        conversion.status = 'completed'
        conversion.save()

    except Exception as e:
        if conversion:
            conversion.status = 'failed'
            conversion.error_message = str(e)
            conversion.save()
        raise

@shared_task
def process_bulk_upload(bulk_upload_id):
    try:
        bulk_upload = BulkUpload.objects.get(id=bulk_upload_id)
        bulk_upload.status = 'processing'
        bulk_upload.save()

        # Read CSV file
        csv_file = bulk_upload.file
        csv_data = csv_file.read().decode('utf-8')
        csv_io = io.StringIO(csv_data)
        reader = csv.DictReader(csv_io)

        # Process each row
        for row in reader:
            bulk_upload.total_records += 1
            bulk_upload.save()

            try:
                # Create tracking conversion
                conversion = TrackingConversion.objects.create(
                    ebay_account=bulk_upload.ebay_account,
                    ebay_order_id=row['ebay_order_id'],
                    amazon_tracking_number=row['tracking_number'],
                    status='pending'
                )

                # Process the conversion
                process_tracking_conversion.delay(conversion.id)
                
                bulk_upload.successful_records += 1

            except Exception as e:
                bulk_upload.failed_records += 1
                bulk_upload.error_message = f"{bulk_upload.error_message}\nError processing row {bulk_upload.total_records}: {str(e)}"

            bulk_upload.processed_records += 1
            bulk_upload.save()

        bulk_upload.status = 'completed'
        bulk_upload.save()

    except Exception as e:
        if bulk_upload:
            bulk_upload.status = 'failed'
            bulk_upload.error_message = str(e)
            bulk_upload.save()
        raise 