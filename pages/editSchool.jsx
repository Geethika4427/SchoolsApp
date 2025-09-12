import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "../../styles/Form.module.css";
import { verifyToken } from "../../lib/auth";
import pool from "../../lib/db";

export default function EditSchool({ school }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [preview, setPreview] = useState(school?.image || null);
  const router = useRouter();

  // Pre-fill form values
  useEffect(() => {
    if (school) {
      setValue("name", school.name);
      setValue("email_id", school.email_id);
      setValue("contact", school.contact);
      setValue("address", school.address);
      setValue("city", school.city);
      setValue("state", school.state);
    }
  }, [school, setValue]);

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append("id", school.id);
      fd.append("name", values.name);
      fd.append("email_id", values.email_id);
      fd.append("contact", values.contact || "");
      fd.append("address", values.address);
      fd.append("city", values.city);
      fd.append("state", values.state);
      if (values.image && values.image[0]) fd.append("image", values.image[0]);

      const res = await fetch(`/api/schools/${school.id}`, {
        method: "PUT",
        body: fd,
      });
      const json = await res.json();

      if (json.success) {
        alert("School updated successfully");
        router.push("/showSchools");
      } else {
        alert("Error: " + (json.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error");
    }
  };

  if (!school) return <p>School not found</p>;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Edit School</h2>
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
            {...register("image")}
          />
          {preview && <img src={preview} alt="Preview" width="100" />}
        </div>

        <button type="submit" className={styles.button}>Update</button>
      </form>
    </div>
  );
}

// ✅ Protect & Fetch School Data
export async function getServerSideProps({ params, req }) {
  const cookies = req.headers.cookie || "";
  const match = cookies
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith((process.env.COOKIE_NAME || "auth_token") + "="));

  if (!match) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const token = match.split("=")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  try {
    const [rows] = await pool.query("SELECT * FROM schools WHERE id = ?", [params.id]);
    return { props: { school: rows[0] || null } };
  } catch (err) {
    console.error(err);
    return { props: { school: null } };
  }
}
