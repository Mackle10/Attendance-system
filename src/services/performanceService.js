
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@services/firebase';

const REVIEWS_COLLECTION = 'performanceReviews';

export const performanceService = {
  // Get all performance reviews
  async getAll() {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const snapshot = await getDocs(reviewsRef);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },

  // Get reviews belonging to a specific employee
  async getByEmployee(employeeId) {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const reviewsQuery = query(
      reviewsRef,
      where('employeeId', '==', employeeId),
    );

    const snapshot = await getDocs(reviewsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },

  // Get one review by its document ID
  async getById(reviewId) {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    const snapshot = await getDoc(reviewRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Create a new performance review
  async create(reviewData) {
    const reviewRef = await addDoc(
      collection(db, REVIEWS_COLLECTION),
      {
        ...reviewData,
        status: reviewData.status || 'Draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    );

    return {
      id: reviewRef.id,
      ...reviewData,
    };
  },

  // Update an existing review
  async update(reviewId, reviewData) {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);

    await updateDoc(reviewRef, {
      ...reviewData,
      updatedAt: serverTimestamp(),
    });

    return {
      id: reviewId,
      ...reviewData,
    };
  },

  // Delete a review
  async delete(reviewId) {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);

    await deleteDoc(reviewRef);

    return true;
  },
};
