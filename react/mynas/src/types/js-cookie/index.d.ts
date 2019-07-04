declare module 'js-cookie' {
    export function get(name: string, options?: object);
    export function set(name: string, value: object);
    export function remove(name: string);
}