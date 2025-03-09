'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

export default function SubscriptionBanner() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/subscription/status/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/subscription/create-checkout-session/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading || !subscriptionStatus) return null;

  if (subscriptionStatus.is_premium) return null;

  const daysLeft = subscriptionStatus.is_trial_active
    ? Math.ceil((new Date(subscriptionStatus.trial_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-indigo-600">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-indigo-800">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <p className="ml-3 font-medium text-white truncate">
              {subscriptionStatus.is_trial_active ? (
                <span className="md:hidden">
                  {daysLeft} days left in trial
                </span>
              ) : (
                <span className="md:hidden">
                  Trial expired
                </span>
              )}
              <span className="hidden md:inline">
                {subscriptionStatus.is_trial_active
                  ? `You have ${daysLeft} days left in your free trial`
                  : 'Your trial has expired. Upgrade to continue using all features'}
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <button
              onClick={handleUpgrade}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Upgrade now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 