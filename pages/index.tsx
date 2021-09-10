import Head from 'next/head'
import { useState } from 'react'
import Color from 'color'
import { ChromePicker } from 'react-color'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

enum ContrastGrade {
  Excellent = 'Great',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

interface RoleEntry {
  color: string
  title: string
  contrast?: number
  contrastGrade?: ContrastGrade
}

const lightMode: Color = Color('#ffffff')
const darkMode: Color = Color('#36393f')

const gradeContrast = (contrast: number): ContrastGrade => {
  if(contrast >= 7) {
    return ContrastGrade.Excellent
  } else if(contrast >= 4.5) {
    return ContrastGrade.Good
  } else if(contrast >= 3) {
    return ContrastGrade.Fair
  } else {
    return ContrastGrade.Poor
  }
}

export default function Home() {
  let roles: RoleEntry[] = [
    { color: '#ffffff', title: 'Test', },
  ]

  roles.forEach((entry: RoleEntry) => {
    let contrast = Color(entry.color).contrast(darkMode)
    entry.contrast = contrast
    entry.contrastGrade = gradeContrast(contrast)
  })

  const [roleEntriesStringified, setRoleEntriesStringified]: [string, Function] = useState(JSON.stringify(roles, null, 2))

  const [roleEntries, setRoleEntries]: [RoleEntry[], Function] = useState(roles)

  const [role, setRole]: [RoleEntry, Function] = useState(roles[0])

  const handleColorChange = (color): void => {
    let contrast = Color(color.hex).contrast(darkMode)
    setRole({
      ...role,
      color: color.hex,
      contrast: contrast,
      contrastGrade: gradeContrast(contrast)
    })
  }

  const handleTextAreaChange = (event): void => {
    setRoleEntriesStringified(event.target.value)
  }

  const handleRerenderSwatchesClick = (): void => {
    try {
      let newEntries: RoleEntry[] = JSON.parse(roleEntriesStringified)
      newEntries.forEach((entry: RoleEntry) => {
        let contrast = Color(entry.color).contrast(darkMode)
        entry.contrast = contrast
        entry.contrastGrade = gradeContrast(contrast)
      })
      setRoleEntries(newEntries)
      setRoleEntriesStringified(JSON.stringify(newEntries, null, 2))
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <div className='container mx-auto px-4'>
      <Head>
        <title>Discord Role Contrast Grader</title>
        <meta name="description" content="Check the quality of your Discord roles' color contrast against light or dark mode backgrounds" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='container mx-auto px-6'>
        <div className='grid grid-cols-3 gap-4 mx-auto px-4'>
          <ChromePicker
            color={ role.color }
            onChange={ handleColorChange }
            onChangeComplete={ handleColorChangeComplete }
            disableAlpha={ true }
            width={ 300 }
            className='mx-auto h-auto px-4'
          />
          <div className='mx-auto h-auto px-4'>{ role.contrastGrade ?? ContrastGrade.Poor } ({ role.contrast ?? 0 })</div>
          <div className='mx-auto px-4 p-4'>
            <ol>
              { roleEntries.map((entry, index) => <li>
                <button className='border-4 rounded' onClick={ handleEntryClick(index) }>
                  <FontAwesomeIcon icon='square' color={ roleEntries[index].color } size='lg' />
                  { roleEntries[index].contrastGrade ?? ContrastGrade.Poor } ({ roleEntries[index].contrast ?? 0 })
                </button>
                <input type='text' value={ roleEntries[index].color } />
                <input type='text' value={ roleEntries[index].title } />
              </li>) }
            </ol>
            {/* <textarea
              className='mx-auto w-full h-full px-4 row-span-3'
              value={ roleEntriesStringified }
              onChange={ handleTextAreaChange }
            /> */}
            <button className='mx-auto w-auto px-4' onClick={ handleUpdateGradesClick }>Re-Render Swatches</button>
          </div>
        </div>
      </main>
    </div>
  )
}
