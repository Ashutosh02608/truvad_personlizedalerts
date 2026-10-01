import Navbar from "@/components/Navbar";
import PersonalizedAlertsForm from "@/components/PersonalizedAlertsForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`dot-grid-background ${styles.pageWrapper}`}>
      {/* Precision-crafted Top Navbar */}
      <Navbar />

      <main className={styles.mainContent}>
        {/* Personalized Alerts Section with Regulators Checkbox Menu & Email Input */}
        <section id="personalized-alerts" className={styles.sectionContainer}>
          <PersonalizedAlertsForm />
        </section>
      </main>
    </div>
  );
}
