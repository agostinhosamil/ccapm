type ObjectFullMergeProp<ObjectsType extends Object = any> = {
  [key: string]: ObjectFullMergeProp<ObjectsType> | ObjectsType | Array<any>
}

// export const objectFullMerge = <ObjectsType extends Object = any>(firstObject: ObjectFullMergeProp<ObjectsType>, ...objects: Array<ObjectFullMergeProp<ObjectsType>>): ObjectFullMergeProp<ObjectsType> => {
//   const mergedObjects: ObjectFullMergeProp<ObjectsType> = firstObject

//   for (const object of objects) {

//     if (!(object && typeof object === 'object')) {
//       continue
//     }

//     const objectKeys = Object.keys(object)

//     for (const key of objectKeys) {
//       const objectKey = key as keyof ObjectFullMergeProp<ObjectsType>
//       const objectKeyValue = object[objectKey]

//       if (typeof mergedObjects[objectKey] === typeof undefined) {
//         mergedObjects[objectKey] = objectKeyValue

//         continue
//       }

//       if (mergedObjects[objectKey] instanceof Array) {
//         mergedObjects[objectKey] = [
//           ...(Array.from(mergedObjects[objectKey] as any[])),
//           ...((objectKeyValue instanceof Array)
//             ? objectKeyValue
//             : [])
//         ]

//         continue
//       }

//       if (typeof mergedObjects[objectKey] === 'object' && mergedObjects[objectKey]) {
//         mergedObjects[objectKey] = objectFullMerge<ObjectsType>(
//           mergedObjects[objectKey] as ObjectFullMergeProp<ObjectsType>,
//           objectKeyValue as ObjectFullMergeProp<ObjectsType>
//         )

//         continue
//       }

//       mergedObjects[objectKey] = objectKeyValue
//     }
//   }

//   return mergedObjects
// }


export const objectFullMerge = <ObjectsType extends Object = any>(firstObject: ObjectsType, ...objects: Array<ObjectsType>): ObjectsType => {
  const mergedObjects: ObjectsType = firstObject

  for (const object of objects) {

    if (!(object && typeof object === 'object')) {
      continue
    }

    const objectKeys = Object.keys(object)

    for (const key of objectKeys) {
      const objectKey = key as keyof ObjectsType
      const objectKeyValue = object[objectKey]

      if (typeof mergedObjects[objectKey] === typeof undefined) {
        mergedObjects[objectKey] = objectKeyValue

        continue
      }

      const currentValue = mergedObjects[objectKey]

      if (currentValue instanceof Array) {
        mergedObjects[objectKey] = [
          ...(Array.from(currentValue)),
          ...((objectKeyValue instanceof Array)
            ? objectKeyValue
            : [])
        ] as ObjectsType[keyof ObjectsType]

        continue
      }

      if (typeof mergedObjects[objectKey] === 'object' && mergedObjects[objectKey]) {
        mergedObjects[objectKey] = objectFullMerge<ObjectsType>(
          mergedObjects[objectKey] as ObjectsType,
          objectKeyValue as ObjectsType
        ) as ObjectsType[keyof ObjectsType]

        continue
      }

      mergedObjects[objectKey] = objectKeyValue
    }
  }

  return mergedObjects
}
