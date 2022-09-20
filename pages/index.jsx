import Head from 'next/head'
import styles from "../styles/Home.module.css";

export default function Home({posts}) {
  return (
    <div className="">
        <Head>
          <title>Melvin's Blog</title>
          <meta name="description" content="A mini blog from yhuakim" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
        <nav className="navbar bg-light fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/logo.svg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
              Melvin's Blog
            </a>
          </div>
        </nav>
        </header>
        <div className={styles.main}>
      <h1>Welcome to Blog Page</h1>
      <div className={styles.feed}>
        {posts.length ? (
          posts.map((post, index) => (
            <div
              key={index}
              className={styles.post}
              onClick={() => router.push(`/posts/${post.slug}`)}
            >
              <img
                className={styles.img}
                src={post.coverImage}
                alt="post thumbnail"
              />
              <h3>{post.title}</h3>
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

  const hashnodeData = await gql(query)

  const {posts} = hashnodeData.data.user.publication

  return {
    props: {
      posts
    },
  };
}