export class ArrayUtil {
    static extractColumn(arr: Array<any>, column: string) {
        const reduction = (previousValue: any, currentValue: any) => {
            previousValue.push(currentValue[column]);
            return previousValue;
        };

        return arr.reduce(reduction, []);
    }
}
