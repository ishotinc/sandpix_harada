import Stripe from 'stripe';

// This script creates Stripe products and prices for SandPix
// Run with: npx tsx scripts/setup-stripe.ts

async function setupStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
    console.log('Add to your .env file:');
    console.log('STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY');
    process.exit(1);
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  try {
    console.log('🚀 Creating SandPix Plus Plan product...');
    
    // Create Plus Plan product
    const product = await stripe.products.create({
      name: 'SandPix Plus Plan',
      description: '5 projects, 50 generations/day, no footer logo',
      metadata: {
        plan_type: 'plus',
        max_projects: '5',
        daily_generations: '50',
        has_footer_logo: 'false'
      }
    });
    
    console.log('✅ Product created:', product.id);

    // Create monthly price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2980, // 2,980 JPY
      currency: 'jpy',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan_type: 'plus'
      }
    });
    
    console.log('✅ Price created:', price.id);
    
    console.log('\n📝 Add these to your .env file:');
    console.log(`VITE_STRIPE_PLUS_PRODUCT_ID=${product.id}`);
    console.log(`VITE_STRIPE_PLUS_PRICE_ID=${price.id}`);
    console.log(`STRIPE_SECRET_KEY=${stripeSecretKey}`);
    
    console.log('\n✨ Stripe setup complete!');
    
  } catch (error) {
    console.error('❌ Error creating Stripe products:', error);
    process.exit(1);
  }
}

setupStripe();