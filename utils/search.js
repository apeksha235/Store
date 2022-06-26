class Search {
    constructor(base,q)
    {
        this.base=base;
        this.q= q;
    }
    filter(){
        const cq = {...this.q};
        delete cq["search"];
        delete cq["limit"];
        delete cq["page"];

        let st = JSON.stringify(cq);
        st = st.replace('/\b(gt|lt|gte|lte)\b/g/',`$${m}`)
        jsonst = JSON.parse(st);
        this.base = this.base.find(jsonst);
    }
    searchword(){
        const sw = this.q.search ?{
          name:{$regex:this.q.search}
        } : {};
        this.base=this.base.find({...sw});
        return this;
    }
    pager(resultpp){
        let currpage = this.q.page || 1;
        const skipage = resultpp * (currpage - 1);
        this.base = this.base.limit(resultpp).skip(skipage);
        return this;

    }
}

module.exports = Search;