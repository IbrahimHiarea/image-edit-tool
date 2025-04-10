export const paths = {
  home: '/',
  dashboard: {
    // * Side bar route
    categories: '/dashboard/categories',
    images: '/dashboard/images',
    annotations: '/dashboard/annotations',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
