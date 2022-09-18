import {reporter} from 'vfile-reporter'
import {remark} from 'remark'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import remarkHtml from 'remark-html'
import {useEffect, useState} from 'react'
import DOMPurify from 'isomorphic-dompurify';
import {marked} from 'marked'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, updateDoc, doc, collection, FieldValue, arrayUnion, getDocs, addDoc } from "firebase/firestore";
//import axios from 'axios'

const Posts = ({post}) => {
  //console.log(post)
  const [content, setContent] = useState('')
  const { isLoading, getData } = useVisitorData({ immediate: true })
  const [modal, setModal] = useState(false)

  const visitedTimes = async ()=> {
    await getData().then(async(visitor) => {
      const visited = {
        visitorId: visitor.visitorId,
        visitedPostId: post[0]._id
      }

      const {visitorId, visitedPostId} = visited

      const firebaseConfig = {
        apiKey: "AIzaSyD3fn5vip2WMqo9NZb-k0Suv9pDWCOZJOY",
        authDomain: "paywall-f2816.firebaseapp.com",
        projectId: "paywall-f2816",
        storageBucket: "paywall-f2816.appspot.com",
        messagingSenderId: "1093369957876",
        appId: "1:1093369957876:web:015d5bb0b50c6c8f7b7da1"
      };

      const app = initializeApp(firebaseConfig);

      const db = getFirestore(app);
      const visitorRef = doc(db, 'visitors', `${visitorId}`)
      
      const Visitors = await getDocs(collection(db, 'visitors'))
      Visitors.forEach(async (visitor) => {
        if(visitor.data().length > 3) {
          setModal(true)
        }
        if(visitorId === visitor.id) {
          console.log(visitor.data());
          updateDoc(visitorRef, {
            visitedPosts: arrayUnion(`${visitedPostId}`)
          })
        } else {
          await addDoc(visitorRef, {
            visitedPosts: arrayUnion(`${visitedPostId}`)
          })
      }
    }
      )

     /*  await setDoc(visitorRef, {
        visitedPosts: arrayUnion(`${visitedPost}`)
      }) */
      
     /*  const data = JSON.stringify(visited)
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const res = await axios.post(`/api/paywall`, data, config)
      setRef(res.data)
      console.log(ref); */

    })
  }
  
  useEffect(()=> {
    visitedTimes()
  }, [content], visitedTimes)

  try {
    remark()
  .use(remarkPresetLintMarkdownStyleGuide)
  .use(remarkHtml)
  .process(JSON.stringify(post[0].contentMarkdown))
  .then((file) => {
    const res = file.toString('utf-8')
    //marked(String(file))
    const data = marked.parse(res)
    //console.log(res)
    setContent(data)
    console.error(reporter(file))
  })
  }catch (error){
    console.error(error);
  }
    return (
        <div className="">
          {}
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />
            {/* <Markdown value={content} /> */}
          {/* <button onClick={handleClick}>view content</button> */}
        </div>
    )
}

export default Posts

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
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
            }
          }
        }
      }
    `
  
    const hashnodeData = await gql(query)
  
    const {posts} = hashnodeData.data.user.publication
  
    // Get the paths we want to pre-render based on posts
    const paths = posts.map((post) => ({
      params: { id: post.slug },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }
  
  // This also gets called at build time
  export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
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
  
    const {posts} = hashnodeData.data.user.publication

    const post = posts.filter((post) => params.id === post.slug)
  
    // Pass post data to the page via props
    return { props: { post } }
  }
  