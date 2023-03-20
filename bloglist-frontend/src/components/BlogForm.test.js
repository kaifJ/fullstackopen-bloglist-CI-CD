import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Testing Blog Form', () => {
    const createBlog = jest.fn()

    createBlog.mockImplementation(event => {
        event.preventDefault()
    })

    const setAuthor = jest.fn()
    const setUrl = jest.fn()
    const setTitle = jest.fn()

    beforeEach(() => {
        render(
            <BlogForm
                createBlog={createBlog}
                setAuthor={setAuthor}
                setUrl={setUrl}
                setTitle={setTitle}
                title={'newtitle'}
                author={'kaif'}
                url={'https://www.google.com'}
            />)
    })

    test('test onChange functionality of all 3 inputs', async () => {
        const user = userEvent.setup()

        const titleElement = screen.getByPlaceholderText('title')
        const authorElement = screen.getByPlaceholderText('author')
        const urlElement = screen.getByPlaceholderText('url')


        expect(titleElement.textContent).toBe('')
        expect(authorElement.textContent).toBe('')
        expect(urlElement.textContent).toBe('')

        await user.type(titleElement, 'hello')
        expect(setTitle.mock.calls).toHaveLength(5)

        await user.type(authorElement, 'kaif')
        expect(setAuthor.mock.calls).toHaveLength(4)

        await user.type(urlElement, 'someurl')
        expect(setUrl.mock.calls).toHaveLength(7)
    })

    test('onCreate should be called with correct details', async () => {
        const user = userEvent.setup()

        const create = screen.getByText('create')

        await user.click(create)
        expect(createBlog).toHaveBeenCalled()

    })


})
