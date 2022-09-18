import Head from 'next/head'

export default function Home({posts}) {
  return (
    <div className="">
        <Head>
          <title>Yhuakims's Blog</title>
          <meta name="description" content="A mini blog from yhuakim" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
        <nav className="navbar bg-light fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/logo.svg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
              Yhuakim's Blog
            </a>
          </div>
        </nav>
        </header>
        <main className='container'>
          <div className="row mt-2">
            { posts && posts.map((post) => (
            <div className="col-6 mt-5 pt-2" key={post.slug}>
              <div className="card mb-3 p-3 border-0 shadow bg-body" >
                <div className="card-image-top">
                  <img src={post.coverImage} width="100%" height="300px" alt="blog-image" />
                </div>
                <div className="card-body">
                  <h1 className="heading card-title">{post.title}</h1>
                  <p className="card-text">{post.brief}</p>
                  <a href={`/posts/${post.slug}`} target='_blank' rel='noreferrer' className="btn btn-outline-secondary btn-sm">Read more</a>
                </div>
              </div>
            </div>
            ))}
          </div>
        </main>
      </div>
  )
}

export async function getStaticProps() {
  async function gql(query, variables={}) {
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

  const hashnodeData = await gql(query)

  const {posts} = hashnodeData.data.user.publication

  return {
    props: {
      posts
    },
  };
}