import pool from '../lib/db';
import styles from '../styles/Show.module.css';
import Link from 'next/link';

export default function ShowSchools({ schools }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Schools</h1>
      <div className={styles.grid}>
        {schools.map((s) => (
            //  <Link href={`/schools/${s.id}`} key={s.id}>
          <article className={styles.card} key={s.id}>
            <div className={styles.imgWrap}>
              <img src={s.image || '/placeholder.png'} alt={s.name} />
            </div>
            <div className={styles.body}>
              <h3 className={styles.name}>{s.name}</h3>
              <p className={styles.address}>{s.address}</p>
              <span className={styles.badge}>{s.city}</span>
              <div style={{ marginTop: '12px' }}>
                <Link href={`/schools/${s.id}`}>
                  <button className={styles.button}>Apply Now</button>
                </Link>
              </div>
            </div>
          </article>
        //   </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [rows] = await pool.query('SELECT id, name, address, city, state, image FROM schools ORDER BY id DESC');
    return { props: { schools: JSON.parse(JSON.stringify(rows)) } };
  } catch (err) {
    console.error('SSR DB error', err);
    return { props: { schools: [] } };
  }
}


