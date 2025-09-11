import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'; 
import styles from '../styles/Form.module.css';
import { verifyToken } from '../lib/auth'; 

export default function AddSchool() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append('name', values.name);
      fd.append('email_id', values.email_id);
      fd.append('contact', values.contact || '');
      fd.append('address', values.address);
      fd.append('city', values.city);
      fd.append('state', values.state);
      if (values.image && values.image[0]) fd.append('image', values.image[0]);

      const res = await fetch('/api/schools', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        alert('School added successfully');
        reset();
        setPreview(null);
        
        router.push('/showSchools');
        
      } else {
        alert('Error: ' + (json.error || 'Unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Network or server error');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Add School</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>School Name</label>
          <input
            className={styles.input}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            {...register("email_id", { required: "Email is required" })}
          />
          {errors.email_id && <span>{errors.email_id.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact</label>
          <input
            className={styles.input}
            type="number"
            {...register("contact", { required: "Contact is required" })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Address</label>
          <input
            className={styles.input}
            {...register("address", { required: "Address is required" })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>City</label>
          <input
            className={styles.input}
            {...register("city", { required: "City is required" })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>State</label>
          <input
            className={styles.input}
            {...register("state", { required: "State is required" })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Image</label>
          <input
            className={styles.fileInput}
            type="file"
            {...register("image", { required: "Image is required" })}
          />
        </div>

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
}

// ✅ Protect route with getServerSideProps
export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || '';
  const match = cookies
    .split(';')
    .map(s => s.trim())
    .find(s => s.startsWith((process.env.COOKIE_NAME || 'auth_token') + '='));

  if (!match) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const token = match.split('=')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: {} };
}