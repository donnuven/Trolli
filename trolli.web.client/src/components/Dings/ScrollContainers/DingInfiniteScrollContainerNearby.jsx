import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
import DingDisplaySmall from "../DingDisplaySmall";
// import PageLoader from "../PageLoader";

import * as dingSvc from "../../../Services/dingService";

export default class DingInfiniteScrollContainerNearby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dings: [],
      hasNextPage: true,
      noDings: false,
      lat: null,
      lon: null
    };

    this.pageIndex = 0;
    this.pageSize = 1;
  }

  componentDidMount = () => {};

  loadItems(page) {
    if (this.state.lat !== null || this.state.lon !== null) {
      const qStr = {
        date: new Date(),
        lat: this.state.lat,
        lon: this.state.lon,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      };

      dingSvc.getPageNearby(qStr).then(resp => {
        let dings = [...this.state.dings];
        if (!resp.item || !resp.item.pagedItems) {
          this.setState({
            hasNextPage: false,
            noDings: true
          });
        } else {
          resp.item.pagedItems.forEach(ding => dings.push(ding));

          this.setState({
            dings,
            hasNextPage: resp.item.hasNextPage
          });

          this.pageIndex++;
        }
      });
    } else {
      navigator.geolocation.getCurrentPosition(response => {
        const lat =
          response.coords.latitude == null ? 0 : response.coords.latitude;
        const lon =
          response.coords.longitude == null ? 0 : response.coords.longitude;

        this.setState({
          lat,
          lon
        });
      });
    }
  }

  mapDingToDisplay = ding => {
    return (
      <DingDisplaySmall key={Math.random().toString() + ding.id} ding={ding} />
    );
  };

  render() {
    // const loader = <PageLoader />;

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems.bind(this)}
        hasMore={this.state.hasNextPage}
        // loader={loader}
      >
        {this.state.noDings ? (
          <div className="text-center mb-3">
            <strong>There aren't any Dings nearby. :(</strong>
          </div>
        ) : (
          this.state.dings.length > 0 &&
          this.state.dings.map(this.mapDingToDisplay)
        )}
      </InfiniteScroll>
    );
  }
}
