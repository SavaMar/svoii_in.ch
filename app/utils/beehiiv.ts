const BEEHIIV_API_KEY = process.env.NEXT_PUBLIC_BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID;
const BEEHIIV_LIST_ID = process.env.NEXT_PUBLIC_BEEHIIV_LIST_ID;

export async function subscribeToNewsletter(email: string, firstName?: string, lastName?: string) {
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    console.error('Beehiiv API configuration is missing');
    return;
  }

  try {
    const response = await fetch('https://api.beehiiv.com/v2/publications/' + BEEHIIV_PUBLICATION_ID + '/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        list_id: BEEHIIV_LIST_ID,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'website_signup',
        utm_medium: 'organic',
        utm_campaign: 'signup',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to newsletter');
    }

    return await response.json();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
} 