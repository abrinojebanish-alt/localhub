import { Review } from '../types';

const REVIEWS_KEY = 'localhub_reviews';

export const reviewService = {
  getAllReviews: (): Review[] => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getReviewsByBusiness: (businessId: string): Review[] => {
    const reviews = reviewService.getAllReviews();
    return reviews.filter(r => r.businessId === businessId);
  },

  createReview: (review: Review): Review => {
    const reviews = reviewService.getAllReviews();
    reviews.push(review);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return review;
  },

  getAverageRating: (businessId: string): number => {
    const reviews = reviewService.getReviewsByBusiness(businessId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  },
};
