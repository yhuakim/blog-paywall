import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home({ posts }) {
  const router = useRouter()
  return (
    <div className="">
      <Head>
        <title>yhuakim's Blog</title>
        <meta name="description" content="A mini blog from yhuakim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav className="navbar bg-light fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/logo.svg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
              yhuakim's Blog
            </a>
          </div>
        </nav>
      </header>
      <div className="container py">
        <h1>Welcome to my Blog Page</h1>
        <div className="row">
          {posts.length ? (
            posts.map((post, index) => (
              <div
                key={index}
                className="col-12 g-5"
                onClick={() => router.push(`/posts/${post.slug}`)}
              >
                <div className='row border border-light rounded'>
                  <div className="p-3 border border-dark-50 col-4">
                    <img
                      className="w-100"
                      src={post.coverImage}
                      alt="post thumbnail"
                    />
                  </div>
                  <div className='col-8'>
                    <h3 className='pt-3'>{post.title}</h3>
                    <p className='text-muted text-truncate'>{post.brief}</p>
                    <a href={`/posts/${post.slug}`} className="mb-3 text-decoration-none btn btn-outline-secondary btn-sm" >Read more</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>No Posts</>
          )}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const query = `
    query {
      user(username: "yhuakim") {
        name
        publication {
          posts {
            slug
            title
            brief
            coverImage
          }
        }
      }
    }
  `
  async function gql(query, variables = {}) {
    const data = await fetch('https://api.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    return data.json();
  }

  const hashnodeData = await gql(query)

  const { posts } = hashnodeData.data.user.publication

  return {
    props: {
      posts
    },
  };
}