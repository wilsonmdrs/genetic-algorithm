export default class GeneticAlgorithm {

    /**
     * Method to Get Red, Green and Blue Values from an Image
     * @param {ImageData} data 
     * @returns Array
     */
    image2Chromossome(data) {
        const vector = []
        let pixel = []
        for (let i = 0; i < data.length; i += 4) {
            pixel = [data[i], data[i+1], data[i+2] ]
            vector.push(...pixel)

        }
        return vector
    }

    /**
     * Method to tranform an Array to ImageData
     * @param {ImageData} imageData 
     * @param {Array} vector 
     * @returns 
     */
    Chromossome2Image(imageData, vector) {
        let count = 0
        let dataIndex = 0
        for (let i = 0; i < vector.length; i++ ) {
            imageData.data[dataIndex] = vector[i] 
            count = count + 1
            dataIndex = dataIndex + 1
            if (count === 3) {
                count = 0
                dataIndex = dataIndex +1
            } 
        }
           
        return (imageData)
    }

    /**
     * Method to insert a random value to the Pixel of an ImageData
     * @param {ImageData} imageData 
     * @returns 
     */
    randomPixels(imageData) {
        for (let i = 0; i < imageData.data.length; i++) {
            imageData.data[i] = Math.floor(Math.random() * (256 - 0) + 0)
        }
        return imageData
    }


    /**
     * Method to create a new Individual
     * @param {ImageData} imageData 
     * @returns 
     */
    newIndividual(imageData) {
        const vector = this.image2Chromossome(imageData.data)
        for (let i = 0; i < vector.length; i++) {
           vector[i] = Math.floor(Math.random() * (256 - 0) + 0)
        }
        return(vector)
    }

    /**
     * Method to calculate the fitness on an individual
     * @param {Array} original 
     * @param {Array} individual 
     * @returns 
     */
    fitnessIndividual(original,  individual) {
        const difference = original.map((item, index) => {
            return Math.abs(item - individual[index])
        })
        // Calcuting the Avarage
        let quality = difference.reduce((total, item) => total + item,0) / difference.length
        quality = original.reduce((total,item) => total + item) - quality
        return quality
    }

   

    /**
     * Method to calculate the Fitness of the Population
     * @param {Array} original 
     * @param {Array of Arrays} population 
     * @returns 
     */
    fitnessPopulation(original, population) {
        const qualities = population.map(chromossome => {
            return this.fitnessIndividual(original, chromossome)
        })
       return qualities
    }

    /**
     * Method to Select the Better according to the Selection Size
     * @param {Array of Arrays} population 
     * @param {Array} qualities 
     * @param {Number} selectionSize 
     * @returns 
     */
    selectingBetters(population, qualities, selectionSize) {
        const parents = []
        let maxQualityIndex
        for (let index = 0; index < selectionSize; index++) {
            maxQualityIndex = qualities.findIndex((value) => value === Math.max(...qualities))
            parents.push([...population[maxQualityIndex]])
            qualities[maxQualityIndex] = -1
        }
        return parents
    }

    
    /**
     * Method to generate children from the betters individuals
     * @param {Array} parents 
     * @param {Number} populationSize 
     * @returns 
     */
    crossover(parents, populationSize) {
        const numberOfOffspring = populationSize - parents.length
        const offspring = new Array(numberOfOffspring).fill(new Array(parents[0].length).fill(0))
        for (let i = 0; i < offspring.length; i++) {
            let firstParentIndex = Math.floor((Math.random() * (parents.length - 0) + 0))
            let secondParentIndex = Math.floor((Math.random() * (parents.length - 0) + 0))
            while (firstParentIndex === secondParentIndex) {
                firstParentIndex = Math.floor((Math.random() * (parents.length - 0) + 0))
                secondParentIndex = Math.floor((Math.random() * (parents.length - 0) + 0))
            }
            let p = [firstParentIndex, secondParentIndex]
            let child = offspring[i].map((item, index) => {
                const randomIndex =  Math.floor((Math.random() * (2 - 0) + 0))
                item = parents[p[randomIndex]][index]
                return item
            })
            offspring[i] = [...child]
        }
        return offspring
    }


    /**
     * Method to Change the Pixels of the children according to the especified mutation percent
     * @param {Array} offspring 
     * @param {Number} mutationPercent 
     * @returns 
     */
    mutation (offspring, mutationPercent) {
        const percent = offspring[0].length * (mutationPercent/100)
        let randomGeneIndex = 0
        const mutation = offspring.map((item) => {
            for (let i = 0; i < percent; i++) {
                randomGeneIndex = Math.floor((Math.random() * (offspring[0].length - 0) + 0))
                item[randomGeneIndex] = Math.floor((Math.random() * (256 - 0) + 0))
            }
            return item
        })
        return mutation
    }
}