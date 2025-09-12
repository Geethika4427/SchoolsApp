// import pool from '../lib/db';
// import styles from '../styles/Show.module.css';
// import Link from 'next/link';

// export default function ShowSchools({ schools }) {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Schools</h1>
//       <div className={styles.grid}>
//         {schools.map((s) => (
//             //  <Link href={`/schools/${s.id}`} key={s.id}>
//           <article className={styles.card} key={s.id}>
//             <div className={styles.imgWrap}>
//               <img src={s.image || '/placeholder.png'} alt={s.name} />
//             </div>
//             <div className={styles.body}>
//               <h3 className={styles.name}>{s.name}</h3>
//               <p className={styles.address}>{s.address}</p>
//               <span className={styles.badge}>{s.city}</span>
//               <div style={{ marginTop: '12px' }}>
//                 <Link href={`/schools/${s.id}`}>
//                   <button className={styles.button}>Apply Now</button>
//                 </Link>
//               </div>
//             </div>
//           </article>
//         //   </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export async function getServerSideProps() {
//   try {
//     const [rows] = await pool.query('SELECT id, name, address, city, state, image FROM schools ORDER BY id DESC');
//     return { props: { schools: JSON.parse(JSON.stringify(rows)) } };
//   } catch (err) {
//     console.error('SSR DB error', err);
//     return { props: { schools: [] } };
//   }
// }

import pool from '../lib/db';
import styles from '../styles/Show.module.css';
import Link from 'next/link';
import { verifyToken } from '../lib/auth';

export default function ShowSchools({ schools, isLoggedIn }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Schools</h1>
      <div className={styles.grid}>
        {schools.map((s) => (
          <article className={styles.card} key={s.id}>
            <div className={styles.imgWrap}>
              <img src={s.image || '/placeholder.png'} alt={s.name} />
            </div>
            <div className={styles.body}>
              <h3 className={styles.name}>{s.name}</h3>
              <p className={styles.address}>{s.address}</p>
              <span className={styles.badge}>{s.city}</span>

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                {/* Everyone can view */}
                <Link href={`/schools/${s.id}`}>
                  <button className={styles.button}>Apply Now</button>
                </Link>

                {/* Only logged-in users can edit/delete */}
                {isLoggedIn && (
                  <>
                  <Link href={`/schools/edit/${s.id}`}>
                      <button className={styles.button} style={{ background: '#2196f3' }}>Edit</button>
                    </Link>
                    <button
                      className={styles.button}
                      style={{ background: '#f44336' }}
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this school?')) {
                          const res = await fetch(`/api/schools/${s.id}`, { method: 'DELETE' });
                          const data = await res.json();
                          if (data.success) {
                            alert('Deleted successfully');
                            window.location.reload();
                          } else {
                            alert('Error deleting: ' + (data.error || 'Unknown'));
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  let isLoggedIn = false;
  const cookies = req.headers.cookie || '';
  const match = cookies
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith((process.env.COOKIE_NAME || 'auth_token') + '='));

  if (match) {
    const token = match.split('=')[1];
    const payload = verifyToken(token);
    if (payload) isLoggedIn = true;
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, name, address, city, state, image FROM schools ORDER BY id DESC'
    );
    return { props: { schools: JSON.parse(JSON.stringify(rows)), isLoggedIn } };
  } catch (err) {
    console.error('SSR DB error', err);
    return { props: { schools: [], isLoggedIn } };
  }
}
