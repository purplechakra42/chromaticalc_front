let f = [1, 1] // factorial memoisation

export function factorial(num: number): number {
    if (f[num] !== undefined) {
        return(f[num])
    } else {
        return(f[num] = num * factorial(num-1))
    }
}
export function arrayToRGB(array: number[]): string {
    if (checkArrayEquality(array, [0,0,0])) {
        return 'Chromatic (No Bench)'
    } else {
        return `${array[0] ? `${array[0]}R` : ""}${array[1] ? `${array[1]}G` : ""}${array[2] ? `${array[2]}B` : ""}`
    }
}
export function generateCombinations(total: number, length: number): number[][] {
    // generate all possible combinations of Total choices spread out across Length options. will contain duplicates
    let out = []
    for (let i = 0; i < length; i++) {
        let tempout = constructSingleValueArray(1,i,length)
        if (total > 1) {
            for (const array of generateCombinations(total-1,length)) {
                out.push(addTwoArrays(tempout,array))
            }
        } else {
            out.push(tempout)
        }
    }
    return out
}
export function flattenCombinations(combinations: number[][]): number[][] {
    // collect all duplicate combinations, and calculate its chances of appearing based on the number of duplicates
    const total = combinations.length
    let out: number[][] = []
    for (const combination of combinations) {
        if (!out.some(item => checkArrayEquality(item.slice(0,3), combination))) {
            out.push([...combination,0])
        }
        let idxOfComb = out.findIndex((item => checkArrayEquality(item.slice(0,3),combination)))
        out[idxOfComb][3] += 1/total
    }
    return out
}
export function getOrdinalSuffix(num: number): string {
    if (num > 20) {
        num -= 10*Math.floor(num/10)
    }
    switch (num) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
    }
}
export function nullToZero(array: (number | null)[]): number[] {
    return array.map(value => value ?? 0)
}
export function sumOfElements(array: number[]): number {
    return array.reduce((runningTotal,currentElement) => runningTotal + currentElement, 0)  
}
export function addTwoArrays(base: number[], addor: number[]): number[] {
    if (base.length != addor.length) {
        throw Error('adding arrays with different lengths')
    }
    return base.map((num, idx) => num + addor[idx])
}
export function subtractTwoArrays(base: number[], subtractor: number[]): number[] {
    if (base.length != subtractor.length) {
        throw Error('subtracting arrays with different lengths')
    }
    return base.map((num, idx) => num - subtractor[idx])
}
export function constructSingleValueArray(value: number, index: number, length: number): number[] {
    let outArray = new Array(length)
    outArray.fill(0)
    outArray[index] = value
    return outArray
}
export function addValueToOneElement(base: number[], value: number, index: number): number[] {
    return addTwoArrays(base, constructSingleValueArray(value, index, base.length))
}
export function checkArrayEquality(arr1: number[], arr2: number[]): boolean {
    if (arr1.length != arr2.length) {
        throw Error('comparing arrays with different lengths')
    }
    for (let [i, element] of arr1.entries()) {
        if (element != arr2[i]) {
            return false
        }
    }
    return true
}