const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID
const APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs'

// Singapore is the closest supported Adzuna country to Philippines
const COUNTRY = 'sg'

/**
 * Fetch job listings from Adzuna based on job role
 * @param {string} role - Job role to search for
 * @param {number} page - Page number (default 1)
 * @param {number} resultsPerPage - Results per page (default 12)
 */
export async function fetchJobsByRole(role, page = 1, resultsPerPage = 12) {
  if (!role) throw new Error('Job role is required.')

  const url = new URL(`${BASE_URL}/${COUNTRY}/search/${page}`)

  url.searchParams.set('app_id', APP_ID)
  url.searchParams.set('app_key', APP_KEY)
  url.searchParams.set('what', role)
  url.searchParams.set('results_per_page', resultsPerPage)
  url.searchParams.set('content-type', 'application/json')
  url.searchParams.set('sort_by', 'date')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`)
  }

  const data = await response.json()

  return {
    jobs: (data.results || []).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Company not listed',
      location: job.location?.display_name || 'Location not specified',
      salary:
        job.salary_min && job.salary_max
          ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
          : job.salary_min
          ? `From $${Math.round(job.salary_min).toLocaleString()}`
          : 'Salary not listed',
      description: job.description
        ? job.description.substring(0, 200) + '...'
        : 'No description available.',
      url: job.redirect_url,
      postedDate: job.created,
      category: job.category?.label || '',
    })),
    totalResults: data.count || 0,
    page,
  }
}