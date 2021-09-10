import Head from 'next/head'
import { useState } from 'react'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
// import iro from '@jaames/iro'
import Color from 'color'
import { SketchPicker } from 'react-color'

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
    { color: '#992D22', title: 'Test', },
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
      <main className='grid grid-cols-3 gap-4 mx-auto px-4'>
        <SketchPicker
          color={ role.color }
          onChange={ handleColorChange }
          disableAlpha={ true }
          presetColors={ roleEntries.map((entry: RoleEntry) => entry.color) }
          width={ 300 }
          className='mx-auto h-auto px-4'
        />
        <div className='mx-auto h-auto px-4'>{ role.contrastGrade ?? ContrastGrade.Poor } ({ role.contrast ?? 0 })</div>
        <div className='mx-auto px-4 grid grid-rows-4'>
          <textarea
            className='mx-auto w-full h-full px-4 row-span-3'
            value={ roleEntriesStringified }
            onChange={ handleTextAreaChange }
          />
          <button className='mx-auto w-auto px-4' onClick={ handleRerenderSwatchesClick }>Re-Render Swatches</button>
        </div>
      </main>
    </div>
  )
}
