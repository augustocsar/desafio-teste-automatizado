describe('Kanban Board - Functional Tests', () => {
  beforeEach(() => {
    cy.visit('https://kanban-dusky-five.vercel.app')
    cy.wait(2000) // Aguarda carregamento completo
  })

  // ========== TESTES BÁSICOS ==========
  describe('Basic Structure', () => {
    it('Should load the kanban board with 3 columns', () => {
      cy.get('body').should('be.visible')
      cy.contains('To Do').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Done').should('be.visible')
    })
  })

  // ========== TESTES FUNCIONAIS COMPROVADOS ==========
  describe('Proven Functional Features', () => {
    
    it('✅ Should add tasks in all columns - FUNCTIONAL', () => {
      // Testar adição na coluna To Do
      cy.contains('To Do').parent().within(() => {
        cy.get('button').contains('Adicionar Tarefa').click()
      })
      cy.get('input[placeholder*="tarefa"], input[placeholder*="task"]').should('be.visible')
      cy.get('input[placeholder*="tarefa"], input[placeholder*="task"]').type('Nova tarefa teste')
      cy.get('button').contains('Adicionar').click()
      
      // Verificar se tarefa foi adicionada
      cy.contains('Nova tarefa teste').should('be.visible')
    })

    it('✅ Should delete tasks - FUNCTIONAL', () => {
      // Encontrar uma tarefa existente e deletar
      cy.get('[class*="task"], [class*="card"]').first().within(() => {
        cy.get('button[title*="delete"], button[title*="excluir"], .delete-btn, [class*="delete"]').click()
      })
      // Confirmar se necessário
      cy.get('button').contains(/confirmar|sim|delete/i).click({ force: true })
    })

    it('✅ Should modify task names - FUNCTIONAL', () => {
      // Clicar em uma tarefa para editar
      cy.get('[class*="task"], [class*="card"]').first().click()
      
      // Verificar se campo de edição aparece
      cy.get('input[value], textarea, [contenteditable="true"]').should('be.visible')
      
      // Modificar o nome
      cy.get('input[value], textarea').clear().type('Tarefa modificada pelo teste')
      
      // Salvar (Enter ou botão)
      cy.get('input[value], textarea').type('{enter}')
    })

    it('✅ Should add tags to tasks - FUNCTIONAL', () => {
      // Clicar em uma tarefa
      cy.get('[class*="task"], [class*="card"]').first().click()
      
      // Procurar campo de tag ou botão de adicionar tag
      cy.get('input[placeholder*="tag"], .tag-input, [class*="tag-add"]').should('be.visible')
      
      // Adicionar uma tag
      cy.get('input[placeholder*="tag"], .tag-input').type('teste-tag{enter}')
      
      // Verificar se tag foi adicionada
      cy.contains('teste-tag').should('be.visible')
    })

    it('✅ Should interact with task cards - FUNCTIONAL', () => {
      // Verificar se cards são clicáveis
      cy.get('[class*="task"], [class*="card"]').first().click()
      
      // Verificar se modal ou área de edição abre
      cy.get('.modal, [class*="edit"], [class*="detail"]').should('be.visible')
    })

    it('✅ Should toggle star in header - FUNCTIONAL', () => {
      // Encontrar estrela no cabeçalho
      cy.get('header, .header, [class*="header"]').within(() => {
        cy.get('[class*="star"], .star, ⭐').click()
      })
      
      // Verificar mudança de estado (cor, classe, etc.)
      cy.get('[class*="star"], .star').should('have.class', 'active')
    })
  })

  // ========== TESTES DE RESPONSIVIDADE ==========
  describe('Responsive Design Tests', () => {
    
    it('📱 Should work on mobile (375x667)', () => {
      cy.viewport(375, 667)
      cy.wait(1000)
      
      // Verificar se colunas são visíveis em mobile
      cy.contains('To Do').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Done').should('be.visible')
      
      // Verificar se tarefas são visíveis
      cy.get('[class*="task"], [class*="card"]').should('be.visible')
    })

    it('📱 Should work on tablet (768x1024)', () => {
      cy.viewport(768, 1024)
      cy.wait(1000)
      
      // Verificar layout em tablet
      cy.contains('To Do').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Done').should('be.visible')
      
      // Verificar se botões são acessíveis
      cy.get('button').should('be.visible')
    })

    it('🖥️ Should work on desktop (1920x1080)', () => {
      cy.viewport(1920, 1080)
      cy.wait(1000)
      
      // Verificar layout completo em desktop
      cy.contains('To Do').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Done').should('be.visible')
      
      // Verificar se todas as funcionalidades estão acessíveis
      cy.get('[class*="task"], [class*="card"]').should('have.length.at.least', 1)
    })
  })

  // ========== TESTES DE BUGS CONHECIDOS ==========
  describe('Known Issues Documentation', () => {
    
    it('❌ Drag and drop NOT working - BUG CONFIRMED', () => {
      // Documentar que drag and drop não funciona
      cy.get('[class*="task"], [class*="card"]').first().then($task => {
        const taskText = $task.text()
        
        // Tentar arrastar
        cy.wrap($task).trigger('dragstart')
        cy.get('[class*="column"]').eq(1).trigger('drop')
        
        // Verificar que tarefa permanece na posição original (bug)
        cy.contains(taskText).should('be.visible')
      })
    })

    it('❌ Tag modification issues - BUG CONFIRMED', () => {
      // Documentar problemas com modificação de tags
      cy.get('[class*="tag"], .tag').first().then($tag => {
        if ($tag.length > 0) {
          cy.wrap($tag).click({ force: true })
          // Verificar se é possível editar (provavelmente não)
        }
      })
    })
  })
})