import Head from "next/head";
import {useState} from 'react'
import Link from 'next/link'

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default function Home({ data }) {
    const [formData, setFormData] = useState({})
    const [movies, setMovies] = useState(data)

    async function saveMovie(e) {
        e.preventDefault()
        setMovies([...movies, formData])
        const response = await fetch('/api/movies', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        
        return await response.json()
    }

    return (
        <div>
            <Head>
                <title>Movie list</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ul >
                    {movies.map(item => (
                        <li key="item.id">
                            <span><strong>{item.title}</strong></span>
                            <span>{item.year}</span>
                            <span>{item.descritpion}</span>
                            <Link href={`/movies/${item.slug}`}>
                                <a>More about this movie</a>
                            </Link>
                        </li>
                    ))}
                </ul>

                <form className="" onSubmit={saveMovie}>
                    <input type="text" placeholder="Title" name="title" onChange={e => setFormData({ ...formData, title: e.target.value })}/>
                    <input type="text" placeholder="Year" name="year" onChange={e => setFormData({ ...formData, year: +e.target.value })} />
                    <textarea name="descritpion" id="" cols="30" rows="10" placeholder="descritpion" onChange={e => setFormData({ ...formData, descritpion: e.target.value })} />
                    <input type="text" placeholder="Slug" name="slug" onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                    <button type="submit">Add movie</button>
                </form>

            </main>
        </div>
    );
}

export async function getServerSideProps() {

    const movies = await prisma.movie.findMany()

    return {
        props: {
            data: movies
        }
    }
}