export type RootStackParamList = {
    index: undefined; // no props expected
    test: undefined; // no props expected
    priceRes: { conversionPrice: string, 
                translateType: string, 
                currentType: string, 
                prevPrice: string, 
                aIExplanation : string,
                similarItems : string[],
                worthOrNot : boolean,  
            };
}; 

export interface AnalysisResult {
    details: string;
    similarProds: string[];
    worthOrNot: boolean;
  }