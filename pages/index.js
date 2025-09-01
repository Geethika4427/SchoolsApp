// import styles from '../styles/Home.module.css';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function Home() {
//   const [search, setSearch] = useState('');

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       window.location.href = `/showSchools?query=${encodeURIComponent(search)}`;
//     }
//   };

//   return (
//     <div className={styles.dashboard}>
  
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>Schools App</div>
//         <div className={styles.navLinks}>
//           <Link href="/addSchool">Add School</Link>
//           <Link href="/showSchools">Find Schools</Link>
//           <Link href="/login">Login</Link>
//           <Link href="/signup">Signup</Link>
//         </div>
//       </nav>

    
//       <h1 className={styles.title}>Welcome to Schools App</h1>
//       <p className={styles.subtitle}>Manage your schools easily. Add new schools or view the list of all schools.</p>

   
//       <form onSubmit={handleSearch} className={styles.searchBar}>
//         <input
//           type="text"
//           placeholder="Search for schools..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>

   
//       {/* <div className={styles.dashboardLinks}>
//         <Link href="/addSchool" className={styles.btn}>Add School</Link>
//         <Link href="/showSchools" className={`${styles.btn} ${styles.btnSecondary}`}>Show Schools</Link>
//       </div> */}
//     </div>
//   );
// }


import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/showSchools?query=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Schools App</div>

        <div className={styles.navLinks}>
          <Link href="/addSchool">Add School</Link>
          <Link href="/showSchools">Find Schools</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>

        {/* Hamburger menu for mobile */}
        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? 'show' : ''}`}>
          <Link href="/addSchool" onClick={() => setMenuOpen(false)}>Add School</Link>
          <Link href="/showSchools" onClick={() => setMenuOpen(false)}>Find Schools</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
        </div>
      </nav>

      <h1 className={styles.title}>Welcome to Schools App</h1>
      <p className={styles.subtitle}>
        Manage your schools easily. Add new schools or view the list of all schools.
      </p>

      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for schools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
