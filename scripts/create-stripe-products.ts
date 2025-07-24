import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function createProducts() {
  try {
    console.log('Creating SandPix Plus Plan product...');
    
    // Create Plus Plan product
    const product = await stripe.products.create({
      name: 'SandPix Plus Plan',
      description: '5 projects, 50 generations/day, no footer logo',
      metadata: {
        plan_type: 'plus'
      }
    });

    console.log('Product created:', product.id);

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2980,
      currency: 'jpy',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan_type: 'plus'
      }
    });

    console.log('Price created:', price.id);
    console.log('\n========================================');
    console.log('Add these to your .env.local file:');
    console.log('========================================');
    console.log(`NEXT_PUBLIC_STRIPE_PLUS_PRODUCT_ID=${product.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID=${price.id}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Error creating Stripe products:', error);
    process.exit(1);
  }
}

// Run the script
createProducts();