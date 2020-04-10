import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class BaseAwareHttpService {

    constructor(private readonly http: HttpClient) { }

    get<T>(url: string): Observable<T> {
        const baseHref = document.getElementsByTagName("base")[0].href;
        if (!baseHref) {
            throw new Error("base href is not defined");
        }
        return this.http.get<T>(`${baseHref}/${url}`);
    }
}
