import pool from '../../lib/db';
import styles from '../../styles/SchoolDetail.module.css';

export default function SchoolDetail({ school }) {
  if (!school) return <p className={styles.notFound}>School not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        <img src={school.image || '/placeholder.png'} alt={school.name} />
      </div>
      <h1 className={styles.name}>{school.name}</h1>
      <div className={styles.details}>
        <p><strong>Address:</strong> {school.address}</p>
        <p><strong>City:</strong> {school.city}</p>
        <p><strong>State:</strong> {school.state}</p>
        <p><strong>Email:</strong> {school.email_id}</p>
        <p><strong>Contact:</strong> {school.contact}</p>
      </div>
      <button className={styles.applyBtn}>Apply Now</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const [rows] = await pool.query('SELECT * FROM schools WHERE id = ?', [id]);
    return { props: { school: rows[0] || null } };
  } catch (err) {
    console.error(err);
    return { props: { school: null } };
  }
}
