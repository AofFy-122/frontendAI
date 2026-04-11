import ImageUploader from '@/components/ImageUploader';
import styles from './page.module.css';

export const metadata = {
  title: 'Flower AI - Identify Flowers Instantly',
  description: 'Upload a picture of a flower and our AI will tell you what it is.',
};

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Flower <span className="title-gradient">AI</span>
        </h1>
        <p className={styles.description}>
          Upload a picture of any flower and our advanced AI model will instantly 
          tell you what species it is. Fast, beautiful, and highly accurate.
        </p>
      </div>

      <div className={styles.content}>
        <div className={`glass-panel ${styles.uploaderContainer}`}>
          <ImageUploader />
        </div>
      </div>
    </main>
  );
}
