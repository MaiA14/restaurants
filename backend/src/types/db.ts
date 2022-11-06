export default interface IDB {
    connect(): Promise<any>;
    disconnect(): Promise<any>; 
    
}