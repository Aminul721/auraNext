import Image from "next/image";
import { FloatingActions } from "@/components/FloatingActions";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icons";
import { RoboticsVideo } from "@/components/RoboticsVideo";
import type { RoboticsVideoSource } from "@/components/RoboticsVideo";
import { Reveal } from "@/components/Reveal";

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=60102090179&text=Hello%2C%20I%20am%20interested%20in%20your%20Humanoid%20Robotics%20services.";

const approvedRoboticsVideo: RoboticsVideoSource | undefined = undefined;

const reasons = [
  {
    icon: "chip" as const,
    title: "Innovation",
    description: "Next-generation humanoid robotics for real-world experiences.",
  },
  {
    icon: "robot" as const,
    title: "Advanced Robotics",
    description: "Interactive movement and presence designed to engage audiences.",
  },
  {
    icon: "shield" as const,
    title: "Safety & Reliability",
    description: "Thoughtful planning and technical readiness for every deployment.",
  },
  {
    icon: "star" as const,
    title: "Premium Experience",
    description: "Polished presentations for corporate and private environments.",
  },
  {
    icon: "settings" as const,
    title: "Custom Solutions",
    description: "Flexible concepts shaped around your venue, audience, and goals.",
  },
  {
    icon: "globe" as const,
    title: "Future-Ready",
    description: "Technology experiences that make a lasting impression.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />

      <main id="main-content">
        <section id="home" className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="grid-overlay" />
            <div className="glow-effect top-left" />
            <div className="glow-effect bottom-right" />
          </div>
          <div className="container hero-container">
            <Reveal className="hero-content">
              <h1 className="hero-title">
                The Future of Humanoid Robotics is{" "}
                <span className="highlight-cyan">Here</span>
              </h1>
              <p className="hero-subtitle">
                Providing premium humanoid robotics solutions for corporate events,
                product launches, expos, education, and exclusive interactive
                experiences.
              </p>
              <div className="hero-actions">
                <a href="#robotics" className="btn btn-primary">
                  Explore Our Robotics
                </a>
                <a href="#contact" className="btn btn-secondary">
                  Contact Us
                </a>
              </div>
            </Reveal>
            <Reveal className="hero-visual" delay="delay-1">
              <div className="image-mockup mockup-large">
                <Image
                  src="/images/hero.webp"
                  alt="AURA humanoid robot"
                  fill
                  priority
                  sizes="(max-width: 768px) 94vw, 560px"
                  className="cover-image"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="about" className="about section-padding">
          <div className="container">
            <Reveal className="section-header">
              <span className="badge">SSM: 003884766-K</span>
              <h2 className="section-title">About AURA HUMANOID TECH</h2>
            </Reveal>
            <div className="about-grid">
              <Reveal className="about-text">
                <p className="lead">
                  We are a technology-focused business specializing in humanoid
                  robotics and innovative robotic experiences.
                </p>
                <p>
                  At AURA HUMANOID TECH, we bring next-generation robotic
                  capabilities into real-world environments. Our focus is on
                  delivering premium service, professional execution, and
                  undeniable reliability for our corporate clients.
                </p>
                <p>
                  We believe in the power of interactive technology to transform
                  events, education, and brand experiences, ensuring that every
                  deployment is executed with precision and corporate readiness.
                </p>
              </Reveal>
              <Reveal className="about-features" delay="delay-1">
                <article className="feature-card glass-panel">
                  <h3>Innovation</h3>
                  <p>Deploying the latest in humanoid mobility and interaction.</p>
                </article>
                <article className="feature-card glass-panel">
                  <h3>Professionalism</h3>
                  <p>Corporate-ready solutions tailored to your brand.</p>
                </article>
                <article className="feature-card glass-panel">
                  <h3>Reliability</h3>
                  <p>Flawless execution with dedicated technical support.</p>
                </article>
                <article className="feature-card glass-panel">
                  <h3>Premium Service</h3>
                  <p>End-to-end management of your robotic experience.</p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="robotics" className="robotics section-padding bg-darker">
          <div className="container">
            <Reveal className="section-header center">
              <h2 className="section-title">Flagship Robotics</h2>
              <p className="section-desc">
                Experience the capabilities of the Aura Humanoid Robot.
              </p>
            </Reveal>

            <div className="robotics-showcase">
              <Reveal className="robotics-visual">
                <div className="image-mockup mockup-full">
                  <Image
                    src="/images/flagship.jpeg"
                    alt="AURA humanoid robot in a modern robotics showroom"
                    fill
                    sizes="(max-width: 1024px) 94vw, 620px"
                    className="cover-image"
                  />
                  <div className="tech-overlay" aria-hidden="true" />
                </div>
              </Reveal>
              <Reveal className="robotics-details" delay="delay-1">
                <h3 className="highlight-cyan">Aura Humanoid Robot</h3>
                <p className="mb-4">
                  Our flagship robotic platform offers unparalleled mobility,
                  interaction, and stage presence for any premium environment.
                </p>
                <ul className="capability-list">
                  <li>
                    <span className="icon" aria-hidden="true" />{" "}
                    <strong>Humanoid Movement:</strong> Fluid, dynamic articulation
                    that captivates audiences.
                  </li>
                  <li>
                    <span className="icon" aria-hidden="true" />{" "}
                    <strong>Intelligent Mobility:</strong> Navigates complex
                    environments and stages seamlessly.
                  </li>
                  <li>
                    <span className="icon" aria-hidden="true" />{" "}
                    <strong>Interactive Demonstrations:</strong> Engaging
                    interactions for guests and attendees.
                  </li>
                  <li>
                    <span className="icon" aria-hidden="true" />{" "}
                    <strong>Stage Interaction:</strong> Perfect for keynotes,
                    product unveils, and performances.
                  </li>
                </ul>
              </Reveal>
            </div>

            <Reveal className="accessories-section mt-5">
              <h3 className="text-center mb-4">
                Professional Event Infrastructure
              </h3>
              <div className="accessories-grid">
                <article className="accessory-card glass-panel">
                  <h4>High-Capacity Batteries</h4>
                  <p>
                    Ensuring extended operation and uninterrupted event usage.
                  </p>
                </article>
                <article className="accessory-card glass-panel">
                  <h4>Fast Chargers</h4>
                  <p>
                    Delivering efficient operational turnaround during full-day
                    schedules.
                  </p>
                </article>
                <article className="accessory-card glass-panel">
                  <h4>Heavy-Duty Transit Flight Case</h4>
                  <p>
                    Guaranteeing safe transportation and professional event
                    logistics.
                  </p>
                </article>
              </div>
            </Reveal>

            <Reveal>
              <RoboticsVideo source={approvedRoboticsVideo} />
            </Reveal>
          </div>
        </section>

        <section id="applications" className="applications section-padding">
          <div className="container">
            <Reveal className="section-header center">
              <h2 className="section-title">Applications &amp; Experiences</h2>
              <p className="section-desc">
                Explore what we can create for your next event with our humanoid
                robotics.
              </p>
            </Reveal>

            <div className="applications-grid">
              <Reveal className="app-card glass-panel">
                <div className="app-heading">
                  <h3>Corporate Launches</h3>
                </div>
                <div className="app-visual">
                  <Image
                    src="/images/corporate-launch.webp"
                    alt="Humanoid robot presenting at a corporate technology launch"
                    fill
                    sizes="(max-width: 768px) 94vw, 560px"
                    className="cover-image"
                  />
                  <span className="app-label">Concept Visualization</span>
                </div>
                <div className="app-content">
                  <p>
                    Elevate your brand with striking robot appearances for product
                    launches, brand activations, corporate ceremonies, and
                    technology showcases.
                  </p>
                </div>
              </Reveal>

              <Reveal className="app-card glass-panel" delay="delay-1">
                <div className="app-heading">
                  <h3>Expos &amp; Trade Fairs</h3>
                </div>
                <div className="app-visual">
                  <Image
                    src="/images/expo.webp"
                    alt="Humanoid robot greeting visitors at a modern robotics trade fair"
                    fill
                    sizes="(max-width: 768px) 94vw, 560px"
                    className="cover-image"
                  />
                  <span className="app-label">Concept Visualization</span>
                </div>
                <div className="app-content">
                  <p>
                    Create a magnetic attraction at exhibition booths and trade
                    fairs to drive brand engagement, visitor interaction, and
                    technology demonstrations.
                  </p>
                </div>
              </Reveal>

              <Reveal className="app-card glass-panel">
                <div className="app-heading">
                  <h3>STEM &amp; Education</h3>
                </div>
                <div className="app-visual">
                  <Image
                    src="/images/stem-edu.webp"
                    alt="Students and an educator interacting with a humanoid robot in a STEM lab"
                    fill
                    sizes="(max-width: 768px) 94vw, 560px"
                    className="cover-image"
                  />
                  <span className="app-label">Concept Visualization</span>
                </div>
                <div className="app-content">
                  <p>
                    Inspire the next generation through interactive applications
                    for schools, colleges, STEM workshops, and technology
                    awareness programs.
                  </p>
                </div>
              </Reveal>

              <Reveal className="app-card glass-panel" delay="delay-1">
                <div className="app-heading">
                  <h3>VIP Weddings &amp; Private Events</h3>
                </div>
                <div className="app-visual">
                  <Image
                    src="/images/wedding-robot.webp"
                    alt="Humanoid robots welcoming guests at a luxury wedding reception"
                    fill
                    sizes="(max-width: 768px) 94vw, 560px"
                    className="cover-image"
                  />
                  <span className="app-label">Concept Visualization</span>
                </div>
                <div className="app-content">
                  <p>
                    Deliver unforgettable premium experiences like an exclusive
                    event greeter, ring bearer, tray bearer, and a highly special
                    entrance experience.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="process section-padding bg-darker">
          <div className="container">
            <Reveal className="section-header center">
              <h2 className="section-title">How It Works</h2>
              <p className="section-desc">
                A seamless process to integrate robotics into your event.
              </p>
            </Reveal>
            <div className="process-steps">
              <Reveal className="step">
                <div className="step-number">01</div>
                <h3>Discuss</h3>
                <p>
                  Tell us about your event, venue, audience, and specific
                  requirements.
                </p>
              </Reveal>
              <Reveal className="step" delay="delay-1">
                <div className="step-number">02</div>
                <h3>Plan</h3>
                <p>
                  We design and propose the appropriate robotic experience tailored
                  for your event.
                </p>
              </Reveal>
              <Reveal className="step" delay="delay-2">
                <div className="step-number">03</div>
                <h3>Deploy</h3>
                <p>
                  Our professional team prepares, transports, and coordinates the
                  entire robotic setup.
                </p>
              </Reveal>
              <Reveal className="step" delay="delay-3">
                <div className="step-number">04</div>
                <h3>Experience</h3>
                <p>
                  Your guests enjoy a flawless and memorable humanoid robotics
                  interaction.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="why-us" className="why-us section-padding">
          <div className="container why-grid">
            <Reveal className="why-visual">
              <div className="image-mockup">
                <Image
                  src="/images/why-aura.jpeg"
                  alt="Humanoid robot interacting with visitors in a robotics showroom"
                  fill
                  sizes="(max-width: 1024px) 94vw, 520px"
                  className="cover-image"
                />
              </div>
              <div className="glass-panel text-center why-trust-card">
                <h3 className="highlight-cyan mb-2">Trust &amp; Excellence</h3>
                <p>
                  Setting the standard for corporate robotic deployments in
                  Malaysia.
                </p>
              </div>
            </Reveal>
            <Reveal className="why-content" delay="delay-1">
              <h2 className="section-title mb-4">
                Why AURA HUMANOID TECH
              </h2>
              <div className="why-cards">
                {reasons.map((reason) => (
                  <article
                    className="why-card glass-panel"
                    key={reason.title}
                  >
                    <span className="why-icon">
                      <Icon name={reason.icon} />
                    </span>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="showcase section-padding bg-darker">
          <div className="container">
            <Reveal className="section-header center">
              <h2 className="section-title">Visual Showcase</h2>
              <p className="section-desc">
                Conceptualizing the future of live events.
              </p>
            </Reveal>
            <div className="showcase-gallery">
              <Reveal className="gallery-item glass-panel">
                <Image
                  src="/images/corporate-stage.webp"
                  alt="Humanoid robot on a corporate event stage"
                  fill
                  sizes="(max-width: 768px) 94vw, 380px"
                  className="cover-image"
                />
                <div className="gallery-overlay">
                  <span>Corporate Stage</span>
                </div>
              </Reveal>
              <Reveal className="gallery-item glass-panel" delay="delay-1">
                <Image
                  src="/images/exhibition.webp"
                  alt="Humanoid robot demonstrating technology at an exhibition booth"
                  fill
                  sizes="(max-width: 768px) 94vw, 380px"
                  className="cover-image"
                />
                <div className="gallery-overlay">
                  <span>Exhibition Booth</span>
                </div>
              </Reveal>
              <Reveal className="gallery-item glass-panel" delay="delay-2">
                <Image
                  src="/images/flagship.jpeg"
                  alt="Humanoid robot displayed in a modern robotics showroom"
                  fill
                  sizes="(max-width: 768px) 94vw, 380px"
                  className="cover-image"
                />
                <div className="gallery-overlay">
                  <span>Technology Showroom</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="cta-section section-padding">
          <div className="container">
            <Reveal className="cta-card glass-panel text-center">
              <h2>Ready to Bring Humanoid Robotics to Your Event?</h2>
              <p>
                Whether you are planning a corporate launch, exhibition,
                educational workshop, or a premium private event, talk to our team
                about creating a robotic experience tailored to your exact
                requirements.
              </p>
              <div className="cta-buttons">
                <a
                  href={whatsappUrl}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
                <a href="#contact" className="btn btn-secondary">
                  Request a Consultation
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="contact section-padding bg-darker">
          <div className="container">
            <Reveal className="section-header center">
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-desc">
                Connect with our corporate team to discuss how AURA HUMANOID TECH
                can elevate your next engagement.
              </p>
            </Reveal>
            <div className="contact-cards">
              <Reveal className="contact-card glass-panel">
                <div className="contact-card-icon">
                  <Icon name="briefcase" />
                </div>
                <h3>AURA HUMANOID TECH</h3>
                <p className="text-muted-sm">SSM Registration:</p>
                <p className="highlight-cyan-sm">003884766-K</p>
                <p className="text-muted-sm mt-2">
                  Malaysia&apos;s premium humanoid robotics solutions provider.
                </p>
              </Reveal>

              <Reveal className="contact-card glass-panel">
                <div className="contact-card-icon">
                  <Icon name="pin" />
                </div>
                <h3>Address</h3>
                <p className="text-muted-sm">
                  No. 1, Jalan Anggerik Tainia AW 31/AW, Kota Kemuning, 40460 Shah
                  Alam, Selangor, Malaysia.
                </p>
              </Reveal>

              <Reveal className="contact-card glass-panel">
                <div className="contact-card-icon">
                  <Icon name="mail" />
                </div>
                <h3>Emails</h3>
                <a
                  href="mailto:info@aurahumanoidtech.com"
                  className="contact-email-link"
                >
                  info@aurahumanoidtech.com
                </a>
                <a
                  href="mailto:sales@aurahumanoidtech.com"
                  className="contact-email-link"
                >
                  sales@aurahumanoidtech.com
                </a>
                <a
                  href="mailto:admin@aurahumanoidtech.com"
                  className="contact-email-link"
                >
                  admin@aurahumanoidtech.com
                </a>
              </Reveal>

              <Reveal className="contact-card glass-panel contact-card-cta">
                <div className="contact-card-icon whatsapp-icon">
                  <Icon name="whatsapp" />
                </div>
                <h3>WhatsApp</h3>
                <p className="text-muted-sm">
                  Reach us directly for fast enquiries and consultations.
                </p>
                <a
                  href={whatsappUrl}
                  className="btn btn-whatsapp mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message Us
                </a>
              </Reveal>
            </div>
            <Reveal className="contact-enquiry">
              <EnquiryForm />
            </Reveal>
          </div>
        </section>
      </main>

      <FloatingActions />

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h2>
              AURA <span>HUMANOID TECH</span>{" "}
              <small>(003884766-K)</small>
            </h2>
            <p className="text-sm text-gray mt-2">
              Kota Kemuning, Shah Alam, Selangor
            </p>
            <p className="mt-4 text-sm text-gray">
              Leading the future of premium humanoid robotics solutions in
              Malaysia.
            </p>
          </div>

          <div className="footer-links">
            <h3>Navigation</h3>
            <nav aria-label="Footer navigation">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#robotics">Robotics</a>
              <a href="#applications">Applications</a>
              <a href="#why-us">Why Us</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div className="footer-contact">
            <h3>Contact Info</h3>
            <p>
              No. 1, Jalan Anggerik Tainia AW 31/AW,
              <br />
              Kota Kemuning, 40460 Shah Alam,
              <br />
              Selangor, Malaysia.
            </p>
            <div className="footer-emails mt-3">
              <a href="mailto:info@aurahumanoidtech.com">
                info@aurahumanoidtech.com
              </a>
              <a href="mailto:sales@aurahumanoidtech.com">
                sales@aurahumanoidtech.com
              </a>
              <a href="mailto:admin@aurahumanoidtech.com">
                admin@aurahumanoidtech.com
              </a>
            </div>
            <a className="footer-phone" href="tel:+60102090179">
              +60 10-209 0179
            </a>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <p>&copy; 2026 AURA HUMANOID TECH. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
