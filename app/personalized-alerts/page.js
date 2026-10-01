import Navbar from "@/components/Navbar";
import PersonalizedAlertsForm from "@/components/PersonalizedAlertsForm";
import styles from "../page.module.css";

export const metadata = {
  title: "Personalized Alerts — TRUVAD",
  description:
    "Configure custom regulatory alerts. Select global authorities and central banks to receive real-time synthesised circulars to your email.",
};

export default function PersonalizedAlertsPage() {
  return (
    <div className={`dot-grid-background ${styles.pageWrapper}`}>
      <Navbar />

      <main className={styles.mainContent}>
        <section className={styles.sectionContainer}>
          <PersonalizedAlertsForm />
        </section>
      </main>
    </div>
  );
}
