import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { projectData, swipeScores } = await req.json()

    // Get user profile for personalization
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Generate landing page HTML using the enhanced template
    const html = generateAdvancedLandingPageHTML(projectData, profile, swipeScores)

    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function generateAdvancedLandingPageHTML(projectData: any, profile: any, swipeScores: any): string {
  const serviceName = projectData.service_name || 'Your Service'
  const serviceDescription = projectData.service_description || 'Amazing service description'
  const ctaText = projectData.cta_text || 'Get Started'
  const redirectUrl = projectData.redirect_url || '#'
  const purpose = projectData.purpose || 'service'
  
  // Determine design style based on swipe scores
  let primaryColor = '#3B82F6'
  let secondaryColor = '#1E40AF'
  let accentColor = '#F59E0B'
  let backgroundColor = '#F8FAFC'
  let textColor = '#1F2937'
  
  // Color scheme based on swipe preferences
  if (swipeScores.warm_score > swipeScores.cool_score) {
    primaryColor = '#F59E0B' // Warm orange
    secondaryColor = '#D97706'
    accentColor = '#EF4444'
  } else if (swipeScores.cool_score > swipeScores.warm_score) {
    primaryColor = '#3B82F6' // Cool blue
    secondaryColor = '#1E40AF'
    accentColor = '#8B5CF6'
  }
  
  if (swipeScores.luxurious_score > 2) {
    primaryColor = '#7C3AED' // Luxury purple
    secondaryColor = '#5B21B6'
    accentColor = '#F59E0B'
    backgroundColor = '#FAFAFA'
  }
  
  if (swipeScores.minimal_score > 2) {
    backgroundColor = '#FFFFFF'
    textColor = '#374151'
  }

  // Generate features based on purpose
  let features = []
  switch (purpose) {
    case 'product':
      features = [
        { icon: '🚀', title: 'High Performance', desc: 'Experience lightning-fast results with our optimized solution.' },
        { icon: '💎', title: 'Premium Quality', desc: 'Built with the highest standards and attention to detail.' },
        { icon: '🔒', title: 'Secure & Reliable', desc: 'Your data is protected with enterprise-grade security.' }
      ]
      break
    case 'service':
      features = [
        { icon: '⚡', title: 'Fast Delivery', desc: 'Get results quickly with our streamlined process.' },
        { icon: '🎯', title: 'Targeted Solutions', desc: 'Customized approach for your specific needs.' },
        { icon: '👥', title: 'Expert Support', desc: 'Professional team ready to help you succeed.' }
      ]
      break
    case 'brand':
      features = [
        { icon: '🏆', title: 'Industry Leader', desc: 'Trusted by thousands of satisfied customers.' },
        { icon: '💡', title: 'Innovation', desc: 'Cutting-edge solutions for modern challenges.' },
        { icon: '🌟', title: 'Excellence', desc: 'Committed to delivering exceptional results.' }
      ]
      break
    case 'lead':
      features = [
        { icon: '📊', title: 'Data-Driven', desc: 'Make informed decisions with comprehensive insights.' },
        { icon: '🎁', title: 'Free Resources', desc: 'Access valuable tools and information at no cost.' },
        { icon: '📈', title: 'Growth Focused', desc: 'Strategies designed to accelerate your success.' }
      ]
      break
    case 'event':
      features = [
        { icon: '🎪', title: 'Unforgettable Experience', desc: 'Create lasting memories with our amazing event.' },
        { icon: '🤝', title: 'Networking', desc: 'Connect with like-minded professionals and experts.' },
        { icon: '📅', title: 'Limited Time', desc: 'Don\'t miss this exclusive opportunity to participate.' }
      ]
      break
    default:
      features = [
        { icon: '⚡', title: 'Fast & Reliable', desc: 'Experience lightning-fast performance with our optimized solution.' },
        { icon: '🎯', title: 'Targeted Results', desc: 'Get precisely what you need with our focused approach.' },
        { icon: '🔒', title: 'Secure & Trusted', desc: 'Your data is safe with our enterprise-grade security measures.' }
      ]
  }

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${serviceName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', 'Noto Sans JP', Roboto, sans-serif;
            line-height: 1.6;
            color: ${textColor};
            background-color: ${backgroundColor};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: transparent;
            padding: 20px 0;
            z-index: 100;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 120px 0 80px;
            text-align: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero p {
            font-size: clamp(1.1rem, 2.5vw, 1.5rem);
            margin-bottom: 40px;
            opacity: 0.95;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: ${primaryColor};
            padding: 18px 45px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 3px solid transparent;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            background: ${accentColor};
            color: white;
        }
        
        .features {
            padding: 100px 0;
            background: white;
        }
        
        .features h2 {
            text-align: center;
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 60px;
            color: ${textColor};
            position: relative;
        }
        
        .features h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: ${primaryColor};
            border-radius: 2px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 40px;
            margin-top: 80px;
        }
        
        .feature {
            background: white;
            padding: 50px 30px;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        .feature:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 25px;
            display: block;
        }
        
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: ${textColor};
            font-weight: 600;
        }
        
        .feature p {
            color: #64748b;
            line-height: 1.7;
            font-size: 1rem;
        }
        
        .testimonials {
            padding: 100px 0;
            background: ${backgroundColor};
        }
        
        .testimonials h2 {
            text-align: center;
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 60px;
            color: ${textColor};
        }
        
        .testimonial {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .testimonial p {
            font-size: 1.2rem;
            font-style: italic;
            margin-bottom: 20px;
            color: #4a5568;
        }
        
        .testimonial-author {
            font-weight: bold;
            color: ${primaryColor};
        }
        
        .cta-section {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
            pointer-events: none;
        }
        
        .cta-section-content {
            position: relative;
            z-index: 2;
        }
        
        .cta-section h2 {
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .cta-section p {
            font-size: clamp(1.1rem, 2.5vw, 1.4rem);
            margin-bottom: 40px;
            opacity: 0.95;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .cta-button-white {
            display: inline-block;
            background: white;
            color: ${primaryColor};
            padding: 18px 45px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .cta-button-white:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            background: ${accentColor};
            color: white;
        }
        
        footer {
            background: #1a202c;
            color: white;
            padding: 60px 0 40px;
            text-align: center;
        }
        
        .footer-content {
            margin-bottom: 30px;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: #a0aec0;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: white;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 15px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .feature {
                padding: 40px 25px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 15px;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">${serviceName}</div>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content animate-fade-in-up">
                <h1>${serviceName}</h1>
                <p>${serviceDescription}</p>
                <a href="${redirectUrl}" class="cta-button">${ctaText}</a>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>${serviceName}を選ぶ理由</h2>
            <div class="features-grid">
                ${features.map(feature => `
                    <div class="feature animate-fade-in-up">
                        <span class="feature-icon">${feature.icon}</span>
                        <h3>${feature.title}</h3>
                        <p>${feature.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="testimonials">
        <div class="container">
            <h2>お客様の声</h2>
            <div class="testimonial animate-fade-in-up">
                <p>"${serviceName}のおかげで、私たちのビジネスは大きく成長しました。素晴らしいサービスです！"</p>
                <div class="testimonial-author">満足したお客様</div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <div class="cta-section-content animate-fade-in-up">
                <h2>今すぐ始めませんか？</h2>
                <p>数千人の満足したお客様に今日から仲間入りしましょう</p>
                <a href="${redirectUrl}" class="cta-button-white">${ctaText}</a>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-links">
                    <a href="#about">会社概要</a>
                    <a href="#privacy">プライバシーポリシー</a>
                    <a href="#terms">利用規約</a>
                    <a href="#contact">お問い合わせ</a>
                </div>
                <p>&copy; 2024 ${serviceName}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-fade-in-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(el);
        });
    </script>
</body>
</html>`
}