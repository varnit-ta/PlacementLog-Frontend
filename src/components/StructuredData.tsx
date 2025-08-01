import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type?: 'WebSite' | 'Organization' | 'Article' | 'BlogPosting';
  data?: any;
}

const StructuredData = ({ type = 'WebSite', data }: StructuredDataProps) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'WebSite':
        return {
          ...baseData,
          name: 'PlacementLog',
          description: 'Track placement statistics, company insights, and manage your placement journey with comprehensive analytics and reports.',
          url: 'https://placementlog.vercel.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://placementlog.vercel.app/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          publisher: {
            '@type': 'Organization',
            name: 'PlacementLog',
            url: 'https://placementlog.vercel.app'
          }
        };
      
      case 'Organization':
        return {
          ...baseData,
          name: 'PlacementLog',
          description: 'Platform for tracking placement statistics and career insights',
          url: 'https://placementlog.vercel.app',
          logo: 'https://placementlog.vercel.app/logo.png',
          sameAs: [
            'https://github.com/varnit-ta/PlacementLog-Frontend',
            'https://github.com/varnit-ta/PlacementLog-Backend'
          ]
        };
      
      case 'Article':
      case 'BlogPosting':
        return {
          ...baseData,
          headline: data?.title || 'Placement Experience',
          description: data?.description || 'Placement experience and insights',
          author: {
            '@type': 'Person',
            name: data?.author || 'PlacementLog User'
          },
          publisher: {
            '@type': 'Organization',
            name: 'PlacementLog',
            url: 'https://placementlog.vercel.app'
          },
          datePublished: data?.publishedDate || new Date().toISOString(),
          dateModified: data?.modifiedDate || new Date().toISOString(),
          ...data
        };
      
      default:
        return { ...baseData, ...data };
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData;
