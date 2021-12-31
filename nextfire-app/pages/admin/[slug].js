import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import ImageUploader from '../../components/ImageUploader';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function AdminPostEdit({}){
    return (
        <AuthCheck>
          <PostManager />
        </AuthCheck>
    )   
}

function PostManager() {
    const [preview, setPreview] = useState(false);
  
    const router = useRouter();
    const { slug } = router.query;
    
    // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const postRef = doc(getFirestore(),'users',auth.currentUser.uid,'posts',slug.toString());
    // const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug);
    const [post] = useDocumentDataOnce(postRef);
  
    return (
      <main className={styles.container}>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>
  
              <PostForm postRef={postRef} defaultValues={post} preview={preview} />
            </section>
  
            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
            </aside>
          </>
        )}
      </main>
    );
  }

  function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  
    const { isValid, isDirty } = formState;
  
    const updatePost = async ({ content, published }) => {
      await updateDoc(postRef, {
        content,
        published,
        updatedAt: serverTimestamp(),
      });
  
      reset({ content, published });
  
      toast.success('Post updated successfully!');
    };
  
    return (
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
        )}
  
        <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
          <textarea
            {...register("content",{
              maxLength: { value: 20000, message: 'content is too long' },
              minLength: { value: 10, message: 'content is too short' },
              required: { value: true, message: 'content is required' },
            })}
          ></textarea>
  
          {/* {errors.content && <p className="text-danger">{errors.content.message}</p>} */}
  
          <fieldset>
            <input className={styles.checkbox} type="checkbox" {...register("published")} />
            <label>Published</label>
          </fieldset>
  
          <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
            Save Changes
          </button>
        </div>
      </form>
    );
  }
  