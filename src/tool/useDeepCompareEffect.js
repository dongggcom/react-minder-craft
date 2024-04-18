import {useEffect, useRef} from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

function copy(source) {
    return cloneDeep(source);
}

function deepCompareEquals(a, b){
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef() 

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = copy(value)
  }

  return ref.current
}

export default function useDeepCompareEffect(callback, dependencies) {
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  )
}