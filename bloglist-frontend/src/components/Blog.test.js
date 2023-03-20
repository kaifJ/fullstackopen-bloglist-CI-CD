import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Test Blog component', () => {
    const dummyData = {
        title: 'Test Title',
        author: 'Kaif Jamadar',
        likes: 10,
        url: 'https://www.google.com',
        user: {
            username: 'root'
        }
    }

    let container
    const updateLike = jest.fn()

    beforeEach(() => {
        container = render(<Blog blog={dummyData} updateLike={updateLike} />).container
    })

    test('Initially Blog renders title and author only', () => {
        let titleElement = screen.getByText('Test Title', { exact: false })
        let authorElement = screen.getByText('Kaif Jamadar', { exact: false })
        let urlElement = container.querySelectorAll('.url-div')
        let likesElement = container.querySelectorAll('.like-div')

        expect(authorElement).toBeDefined()
        expect(titleElement).toBeDefined()
        expect(urlElement.length).toBe(0)
        expect(likesElement.length).toBe(0)
    })

    test('Url and likes should be shwon after cliking show details', async () => {
        const user = userEvent.setup()
        const showButton = container.querySelector('.toggleButton')

        await user.click(showButton)
        const urlElement = screen.getByText('https://www.google.com')
        const likesElement = container.querySelectorAll('.like-div')

        expect(urlElement).toBeDefined()
        expect(likesElement.length).toBe(1)
    })

    test('when like button is clicked twice , the handler should be called twice', async () => {
        const user = userEvent.setup()
        const showButton = container.querySelector('.toggleButton')

        await user.click(showButton)

        const likeButton = screen.getByText('Like')
        await user.click(likeButton)
        await user.click(likeButton)
        await user.click(likeButton)

        expect(updateLike.mock.calls).toHaveLength(3)
    })

})