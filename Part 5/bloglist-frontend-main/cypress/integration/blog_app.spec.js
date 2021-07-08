describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: "testUser",
      username: "root",
      password: "123"
    }
    const secondUser = {
      name: "Second User",
      username: "groot",
      password: "123"
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('123')
      cy.get('#login-button').click()

      cy.contains('testUser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'testUser logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: '123'})

      cy.createBlog({
        title: 'Life of Brian',
        author: 'Jake',
        url: 'jake.com/lifeofbrian',
        likes: '10'
      })
      cy.createBlog({
        title: 'Monty Python',
        author: 'Elderberries',
        url: 'Shruberry',
        likes: '15'
      })

      cy.contains('logout').click()
      cy.login({ username: 'groot', password: '123'})

      cy.createBlog({
        title: 'Silly walks',
        author: 'The Ministry',
        url: 'magic.com',
        likes: '20'
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      
      cy.get('#title').type('test Title')
      cy.get('#author').type('test Author')
      cy.get('#url').type('test url')
      cy.get('#newBlogButton').click()

      cy.get('.notification').should('contain', 'a new blog test Title by test Author added')
      cy.get('.blog').should('contain', 'test Title test Author')
    })

      it('User can like a blog', function() {
        cy.contains('Life of Brian')
          .contains('view')
          .click()
        cy.contains('Life of Brian')
          .contains('likes')
          .click()
  
        cy.contains('Life of Brian')
          .contains('Likes 11')
      })

      it('Correct user can delete a blog', function() {
        cy.contains('Silly walks')
          .contains('view')
          .click()
        cy.contains('Silly walks')
          .contains('remove')
          .click()

        cy.get('html').should('not.contain', 'Silly walks')
      })
      
      it('Wrong user cannot delete a blog', function() {
        cy.contains('Life of Brian')
          .contains('view')
          .click()

        cy.contains('Life of Brian')
          .contains('remove')
          .should('not.be.visible')
      })

      it.only('Blogs are order according to number of likes', function() {
        cy.get('.blog')
          .should(($blog) => {
            let texts = $blog.map((i, el) => {
              return Cypress.$(el).text()
            })

            texts = texts.get()

            expect(texts).to.have.length(3)

            expect(texts[0]).contains('Likes 20')
            expect(texts[1]).contains('Likes 15')
            expect(texts[2]).contains('Likes 10')

          })
      })
  })
  
})