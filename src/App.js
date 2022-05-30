import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'

// Assets
import Image1 from './images/fruit.jpg'
import Image2 from './images/image-result.png'
import './App.scss'

// Components
import Input from './Input'
import GeneticAlgorithm from './GeneticAlgorithm'

function App() {
  // Count the number of Generations
  const [count, setCount] = useState(0)
  // Store the last population 
  const [population, setPopulation] = useState([])
  // Control the Start and Stop of the Current Process
  const [start, setStart] = useState(false)
  // Settings to Start a new generation
  const [data, setData] = useState({
    populationSize: 20,
    selectionSize: 10,
    mutationPercent: 1,
    generations: 100,
  })
  // Genetic Algorithm Component
  const ga = useMemo(() => new GeneticAlgorithm(), [])
  // Canvas Element References
  const CanvasResultRef = useRef()
  const CanvasOriginalRef = useRef()


  /**
   * Method to create an new generation with random pixels
   */
  const onNewPopulation = useCallback(() => {
    if (!!CanvasResultRef.current) {
      const initialPopulation = []
      for (let index = 0; index < data.populationSize; index++) {
        const canvas = CanvasResultRef.current
        const context = canvas.getContext('2d')
        const initialImage = context.getImageData(0, 0, canvas.width, canvas.height)
        initialPopulation.push(ga.newIndividual(initialImage))
      }

      setPopulation([...initialPopulation])
    }
  }, [data.populationSize, ga])

  /**
   * Method to add an image to Canvas
   * @param {Element} canvasRef 
   * @param {String} img 
   */
  const uploadImage = useCallback((canvasRef, img) => {

    let newImage = new Image()
    newImage.src = img
    const canvas = canvasRef.current
    canvas.width = newImage.width
    canvas.height = newImage.height
    const context = canvas.getContext('2d')
    newImage.onload = () => {
      context.drawImage(newImage, 0, 0, newImage.width, newImage.height)
    }
    console.log("upload Image")
  }, [])


  /**
   * Method to Call the Functions from Genetic Algorithm Component
   */
  const onSolution = useCallback(() => {

    // Get the Original Image to set a target Value in the first generation
    const canvas = CanvasOriginalRef.current
    const context = canvas.getContext('2d')
    const target = context.getImageData(0, 0, canvas.width, canvas.height)

    // FITNESS - determining how fit an individual is
    const qualities = ga.fitnessPopulation(ga.image2Chromossome(target.data), population)
    console.log(`Melhor Individuo: ${qualities[qualities.findIndex((value) => value === Math.max(...qualities))]} | Geração: ${count + 1}`)

    // SELECTION -  select the fittest individuals
    const parents = ga.selectingBetters(population, qualities, parseInt(data.selectionSize))
    const bestIndividual = [...parents[0]]

    // CROSSOVER - Getting a new Generation
    const offspring = ga.crossover(parents, parseInt(data.populationSize))

    // MUTATION - Maintaining diversity within the population and preventing premature convergence
    const mutation = ga.mutation(offspring, parseInt(data.mutationPercent))

    // GENERATION - Saving the new Generation 
    setPopulation([...parents, ...mutation])
    const imageData = ga.Chromossome2Image(target, bestIndividual)
    const canvasResult = CanvasResultRef.current
    const contextResult = canvasResult.getContext('2d')
    contextResult.putImageData(imageData, 0, 0,)
  }, [population, data.populationSize, data.mutationPercent, data.selectionSize, ga, count])

  // Setting Standard images to the canvas element
  useEffect(() => {

    uploadImage(CanvasOriginalRef, Image1)
    uploadImage(CanvasResultRef, Image2)

  }, [uploadImage])

  // Method to Start, Stop the generation after beggining
  useEffect(() => {

    if (start && count < data.generations) {
      onSolution()
      setCount(count + 1)
    } else if (count >= data.generations) {
      setStart(false)
      setCount(0)
      onNewPopulation()

    }
  }, [count, start, data.generations, onNewPopulation, onSolution])


  const onFilterForm = (key, value) => {

    if (!isNaN(value)) {
      setData({...data, [key]:value})
    }else {
      console.warn("This Input only receive number")
    }


  }

  /**
   * Method to set a new Population and start the Solution
   */
  const onStart = () => {
    if (start) {
      setStart(false)
    } else {
      onNewPopulation()
      setStart(true)
    }
  }

  /**
   * Method to Stop the generation
   */
  const onStop = () => {
    setStart(false)
    setCount(0)
    onNewPopulation()
  }

  /**
   * Method to Pause and Continue The Generation
   */
  const onPause = () => {
    setStart(!start)
  }
  const getYear = () => {
    const d = new Date();
    let year = d.getFullYear();
    return year
  }

  return (
    <div className="app">
      {/* Header */}
      <div className='app__header'>
        <div className='app__header-title'>
          <h1>Genetic Algorithm</h1>
        </div>
        {/* Form */}
        <div className='app__form'>
          <Input
            label="Population"
            value={data.populationSize}
            onChange={e => {
              onFilterForm('populationSize', e.target.value)
            }
            }
          />
          <Input
            label="Selection"
            value={data.selectionSize}
            onChange={e => {
              onFilterForm('selectionSize', e.target.value)
            }
            }
          />
          <Input
            label="Mutation"
            value={data.mutationPercent}
            onChange={e => {
              onFilterForm('mutationPercent', e.target.value)
            }
            }
          />
          <Input
            label="Generations"
            value={data.generations}
            onChange={e => {
              onFilterForm('generations', e.target.value)
            }
            }
          />

          {/* Start, Pause and Stop Generation Button */}
        </div>
        {start || count > 0 ? (
          <div className='app__button-container'>
            <button
              className='app__button_pause'
              onClick={() => onPause()}
            >
              {start ? "Pause" : "Continue"}
            </button>
            <button
              className='app__button_stop'
              onClick={() => onStop()}
            >
              Stop
            </button>
          </div>

        ) : (
          <div className='app__button-container'>
            <button
              className='app__button'
              onClick={() => onStart()}
            >
              Start
            </button>
          </div>
        )}

        {/* Generation Count */}
        <div className='app_generation-header'>
          <p>Generation: {count} </p>
        </div>
      </div>

      {/* Images */}
      <div className='app__content'>
        <div className='app__origin-container'>
          <p>Original Image</p>
          <canvas className='app__canvas' ref={CanvasOriginalRef} src={Image1} />
        </div>
        <div className='app__last-result'>
          <p>Result Image</p>
          <canvas className='app__canvas' ref={CanvasResultRef} />
        </div>
      </div>
      <div className='app__footer'>
          <p>Developed by Wilson Medeiros Jr. © - {getYear()}</p>
      </div>

    </div>
  );
}


export default App;
