/* eslint-disable no-undef */
describe('Blog App', () => {
    beforeEach(function () {
        cy.visit('http://localhost:3000/')
    })

    it('Login form is shown by default', function () {
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('root')
            cy.get('#password').type('rootuser')
            cy.get('#login-button').click()

            cy.contains('Logged In Successfully')

        })

        it('fails with wrong credentials', function () {
            cy.get('#username').type('root')
            cy.get('#password').type('something')
            cy.get('#login-button').click()

            cy.contains('Wrong credentials')
        })
    })

    // describe('Blog Operations', function () {
    //     beforeEach(function () {
    //         cy.login({ username: 'root', password: 'rootuser' })
    //         cy.createBlog({ title: 'New Blog 1', author: 'Kaif Jamadar', url: 'http://www.google.com' })
    //     })

    //     it('like test', function () {
    //         cy.contains('New Blog 1').parent().find('button').click()
    //         cy.contains('New Blog 1').parent().get('.like-div').contains('Likes 0')
    //         cy.contains('New Blog 1').parent().get('#like-button').click()
    //         cy.contains('New Blog 1').parent().get('.like-div').contains('Likes 1')
    //     })

    //     it('user should be able to delete the blog', function () {
    //         cy.contains('New Blog 1').parent().find('button').click()
    //         cy.contains('New Blog 1').parent().get('#delete-button').click()
    //     })

    //     it('non owner should not be able to delete', function () {
    //         cy.request('POST', 'http://localhost:3000/api/users', {
    //             name: 'test user',
    //             username: 'tester',
    //             password: 'tester'
    //         })

    //         cy.login({ username: 'tester', password: 'tester' })
    //         cy.contains('New Blog 1').parent().find('button').click()
    //         cy.contains('New Blog 1').parent().not('#delete-button')
    //     })
    // })

    // describe('most likes', function () {
    //     beforeEach(function () {
    //         cy.login({ username: 'root', password: 'rootuser' })
    //         cy.createBlog({ title: 'Blog with least likes', author: 'kaif', url: 'url3', likes: 3 })
    //         cy.createBlog({ title: 'Blog with 2nd most likes', author: 'kaif', url: 'url2', likes: 5 })
    //         cy.createBlog({ title: 'Blog with the most likes', author: 'kaif', url: 'url1', likes: 6 })
    //     })

    //     it('should show the most liked blog first', function () {
    //         cy.get('.individual-blog').eq(0).should('contain', 'Blog with the most likes')

    //         cy.contains('Blog with 2nd most likes').parent().find('button').click()
    //         cy.contains('Blog with 2nd most likes').parent().get('#like-button').click()
    //         cy.contains('Blog with 2nd most likes').parent().get('#like-button').click()
    //         cy.contains('Blog with 2nd most likes').parent().get('#like-button').click()

    //         cy.visit('http://localhost:3000')
    //         cy.get('.individual-blog').eq(0).should('contain', 'Blog with 2nd most likes')
    //     })
    // })
})