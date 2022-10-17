import { unified } from 'unified';
import parse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark'
import Modal from 'react-bootstrap/Modal';
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import React, { useEffect, useState } from 'react'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { db } from "../../components/firedaseHelper";
import {
  updateDoc,
  doc,
  arrayUnion,
  setDoc,
  getDocFromServer,
} from "firebase/firestore";
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Post.module.css'
import Link from 'next/link';
//import axios from 'axios'

const Posts = ({ post }) => {
  const [content, setContent] = useState('')
  const [visitorId, setVisitorId] = useState()
  const { isLoading, getData } = useVisitorData({ immediate: true })
  const [modal, setModal] = useState(false)
  const [timesVisited, setTimesVisited] = useState(0)
  const [updated, setUpdated] = useState(false);
  const [visitTimes, setVisitTimes] = useState(0);

  const visitedTimes = async () => {
    /* await getData().then(async(visitor) => {
      const visited = {
        visitorId: visitor.visitorId,
        visitedPostId: post[0].slug
      }

      const {visitorId, visitedPostId} = visited
      
      const visitorRef = doc(db, 'visitors', `${visitorId}`)
      
      const Visitors = await getDocs(collection(db, 'visitors'))
      Visitors.forEach(async (visitor) => {
        if(visitorId === visitor.id) {
          console.log(visitor.data(), visitor.data().visitedPosts.length);
          updateDoc(visitorRef, {
            visitedPosts: arrayUnion(`${visitedPostId}`)
          })
        } else {
          await addDoc(visitorRef, {
            visitedPosts: arrayUnion(`${visitedPostId}`)
          })
      }
      if(visitor.data().visitedPosts.length > 3 || visitor.data().visitedPosts.length === 3) {
        setModal(true)
      }
    }
      )
    }) */
    await getData().then(async (visitor) => {
      const visited = {
        visitorId: visitor.visitorId,
        visitedPostId: post[0].slug,
      };

      const { visitorId, visitedPostId } = visited;
      console.log(visitedPostId, visitorId)

      const visitorRef = doc(db, 'visitors', `${visitorId}`)

      const documentSnap = await getDocFromServer(visitorRef)

      if (documentSnap.exists()) {
        await updateDoc(visitorRef, {
          visitedPosts: arrayUnion(visitedPostId)
        })
        setUpdated(true)
        if (documentSnap.data().visitedPosts.length >= 3) {
          setModal(true)
        }
        setVisitTimes(documentSnap.data().visitedPosts.length)
      } else {
        setDoc(visitorRef, {
          visitedPosts: visitedPostId
        })
      }


    });
  }

  useEffect(() => {
    visitedTimes()
    const data = unified()
      .use(parse)
      .use(remarkRehype)
      .use(rehypeReact, { createElement: React.createElement })
      .processSync(post[0].contentMarkdown).toString()
    setContent(data)
    console.log(data);
  }, [modal, updated])

  return (
    <div className={modal ? styles.main : ''}>
      {modal ?
        <Modal centered show={modal} onHide={() => window.location.href("/")} animation={true}>
          <Modal.Header>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Oops! Seems you have exceeded your allocated free articles. You can get back by subscribing</Modal.Body>
          <Modal.Footer>
            <Link role='button' className='btn btn-secondary' href='/'>
              Go Home
            </Link>
            <Link className='btn btn-secondary' href='#'>
              Pay Now
            </Link>
          </Modal.Footer>
        </Modal>
        :
        <ReactMarkdown remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={atomDark}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            img({ children, node, src, className, ...props }) {
              return (
                <img src={src} {...props} />
              )
            }
          }}
          className="container"
        >{content}
        </ReactMarkdown>
      }
    </div>
  )
}

export default Posts

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
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

  const query = `
      query {
        user(username: "yhuakim") {
          name
          publication {
            posts {
              slug
            }
          }
        }
      }
    `

  const hashnodeData = await gql(query)

  const { posts } = hashnodeData.data.user.publication

  const paths = posts.map((post) => ({
    params: { id: post.slug },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
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

  const query = `
    query {
      user(username: "yhuakim") {
        name
        publication {
          posts {
            _id
            title
            coverImage
            slug
            contentMarkdown
          }
        }
      }
    }
  `

  const hashnodeData = await gql(query)

  const { posts } = hashnodeData.data.user.publication

  const post = posts.filter((post) => params.id === post.slug)

  return { props: { post } }
}