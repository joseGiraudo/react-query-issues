import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Issue, State } from "../interfaces/issue";

interface Props {
    state?: State;
    labels: string[];
    page?: number;
}


const getIssues =async ({ labels, state, page = 1 }: Props ):Promise<Issue[]> => {
    
    await sleep(2);

    const params = new URLSearchParams();

    if( state )  params.append( 'state', state);

    if( labels.length > 0 ) {
        const labelString = labels.join(','); // [label1, label2, label3, ..]
        params.append('labels', labelString)
    }

    params.append('page', page.toString() );
    params.append('per_page', '5');

    const { data } = await githubApi.get<Issue[]>('/issues', { params });
    return data;
}

export const useIssues = ({ state, labels }: Props) => {
    
    const [page, setPage] = useState(1);

    // cuando cambie algo volver a la pagina 1
    useEffect(() => {
      setPage(1);
    }, [state, labels])
    

    const issuesQuery = useQuery(
        ['issues', { state, labels, page }], // cuando el orden de los factores no importa mandamos un objeto en react query
        () => getIssues({ labels, state, page })
    );

    const nextPage = () => {
        if ( issuesQuery.data?.length === 0) return; // no hay mas data por lo tanto no devuelvo mas paginas

        setPage( page + 1 );
    }

    const prevPage = () => {
        if (page > 1) setPage( page - 1)
    }


    return {
        // properties
        issuesQuery,

        // getter
        page: issuesQuery.isFetching ? 'Loading' : page,

        // methods
        nextPage,
        prevPage,
    }

}