document.addEventListener('DOMContentLoaded', () => {
  const textArea = document.getElementById('textArea')
  const keyboardContainer = document.getElementById('keyboard')
  const clearBtn = document.getElementById('clearBtn')
  const copyBtn = document.getElementById('copyBtn')
  document.getElementById('year').textContent = new Date().getFullYear();

  const keyboardLayout = [
    [
      { fr: '&', ar: '1' },
      { fr: 'é', ar: '2' },
      { fr: '"', ar: '3' },
      { fr: "'", ar: '4' },
      { fr: '(', ar: '5' },
      { fr: '-', ar: '6' },
      { fr: 'è', ar: '7' },
      { fr: '_', ar: '8' },
      { fr: 'ç', ar: '9' },
      { fr: 'à', ar: '0' },
      { type: 'backspace', label: '⌫' }
    ],
    [
      { fr: 'a', ar: 'ض' },
      { fr: 'z', ar: 'ص' },
      { fr: 'e', ar: 'ث' },
      { fr: 'r', ar: 'ق' },
      { fr: 't', ar: 'ف' },
      { fr: 'y', ar: 'غ' },
      { fr: 'u', ar: 'ع' },
      { fr: 'i', ar: 'ه' },
      { fr: 'o', ar: 'خ' },
      { fr: 'p', ar: 'ح' },
      { fr: '^', ar: 'ج' },
      { type: 'return', label: '↵' }
    ],
    [
      { fr: 'q', ar: 'ش' },
      { fr: 's', ar: 'س' },
      { fr: 'd', ar: 'ي' },
      { fr: 'f', ar: 'ب' },
      { fr: 'g', ar: 'ل' },
      { fr: 'h', ar: 'ا' },
      { fr: 'j', ar: 'ت' },
      { fr: 'k', ar: 'ن' },
      { fr: 'l', ar: 'م' },
      { fr: 'm', ar: 'ك' },
      { fr: 'ù', ar: 'ط' },
      { fr: '*', ar: 'ذ' }
    ],
    [
      { fr: 'w', ar: 'ئ' },
      { fr: 'x', ar: 'ء' },
      { fr: 'c', ar: 'ؤ' },
      { fr: 'v', ar: 'ر' },
      { fr: 'b', ar: 'لا' },
      { fr: 'n', ar: 'ى' },
      { fr: ',', ar: 'ة' },
      { fr: ';', ar: 'و' },
      { fr: ':', ar: 'ز' },
      { fr: '!', ar: 'ظ' }
    ],
    [
      { type: 'space', label: 'Space' }
    ]
  ]

  const keyElementsMap = {}
  const frToArMap = {}

  function insertAtCursor(textToInsert) {
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const value = textArea.value

    textArea.value = value.substring(0, start) + textToInsert + value.substring(end)
    textArea.selectionStart = textArea.selectionEnd = start + textToInsert.length
    textArea.focus()
  }

  function handleBackspace() {
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const value = textArea.value

    if (start !== end) {
      textArea.value = value.substring(0, start) + value.substring(end)
      textArea.selectionStart = textArea.selectionEnd = start
    } else if (start > 0) {
      textArea.value = value.substring(0, start - 1) + value.substring(start)
      textArea.selectionStart = textArea.selectionEnd = start - 1
    }
    textArea.focus()
  }

  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div')
    rowDiv.className = 'keyboard-row'

    row.forEach(keyData => {
      const btn = document.createElement('button')

      if (keyData.type === 'space') {
        btn.className = 'key space'
        btn.textContent = keyData.label
        btn.addEventListener('click', () => insertAtCursor(' '))
        keyElementsMap['space'] = btn
      } else if (keyData.type === 'backspace') {
        btn.className = 'key backspace'
        btn.textContent = keyData.label
        btn.addEventListener('click', handleBackspace)
        keyElementsMap['backspace'] = btn
      } else if (keyData.type === 'return') {
        btn.className = 'key return'
        btn.textContent = keyData.label
        btn.addEventListener('click', () => insertAtCursor('\n'))
        keyElementsMap['return'] = btn
      } else {
        btn.className = 'key'

        const frSpan = document.createElement('span')
        frSpan.className = 'key-fr'
        frSpan.textContent = keyData.fr

        const arSpan = document.createElement('span')
        arSpan.className = 'key-ar'
        arSpan.textContent = keyData.ar

        btn.appendChild(frSpan)
        btn.appendChild(arSpan)

        btn.addEventListener('click', () => insertAtCursor(keyData.ar))

        if (keyData.fr) {
          const lowerFr = keyData.fr.toLowerCase()
          frToArMap[lowerFr] = keyData.ar
          keyElementsMap[lowerFr] = btn
        }
      }

      rowDiv.appendChild(btn)
    })

    keyboardContainer.appendChild(rowDiv)
  })

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (document.activeElement !== textArea && document.activeElement !== document.body) return

    const pressedKey = e.key.toLowerCase()

    if (frToArMap[pressedKey]) {
      e.preventDefault()
      insertAtCursor(frToArMap[pressedKey])
      triggerVisualFeedback(keyElementsMap[pressedKey])
    } else if (e.key === 'Backspace' && document.activeElement !== textArea) {
      e.preventDefault()
      handleBackspace()
      triggerVisualFeedback(keyElementsMap['backspace'])
    } else if (e.key === 'Enter' && document.activeElement !== textArea) {
      e.preventDefault()
      insertAtCursor('\n')
      triggerVisualFeedback(keyElementsMap['return'])
    } else if (e.key === ' ' && document.activeElement !== textArea) {
      e.preventDefault()
      insertAtCursor(' ')
      triggerVisualFeedback(keyElementsMap['space'])
    }
  })

  function triggerVisualFeedback(btnElement) {
    if (!btnElement) return
    btnElement.style.backgroundColor = '#e4e4e7'
    setTimeout(() => {
      btnElement.style.backgroundColor = ''
    }, 120)
  }

  clearBtn.addEventListener('click', () => {
    textArea.value = ''
    textArea.focus()
  })

  copyBtn.addEventListener('click', async () => {
    if (!textArea.value) return
    try {
      await navigator.clipboard.writeText(textArea.value)
      const originalText = copyBtn.textContent
      copyBtn.textContent = 'Copied!'
      setTimeout(() => {
        copyBtn.textContent = originalText
      }, 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  })
})