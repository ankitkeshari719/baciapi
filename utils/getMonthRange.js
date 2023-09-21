 function getMonthRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
  
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
  
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
  
      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    return months;
  }

  function parseActionDataForChart(finalData,actionsData){
    finalData.map((chartObject) => {
      const chartYear = new Date(chartObject.month).getYear();
      const chartMonth = new Date(chartObject.month).getMonth();

      actionsData.forEach((jiraAction) => {
        const jiraYear  = new Date(jiraAction.updatedAt).getYear();
        const jiraMonth = new Date(jiraAction.updatedAt).getMonth();
       
        if (chartYear == jiraYear && chartMonth == jiraMonth) {
          if (jiraAction.status == "DONE") {
            chartObject.completed = chartObject.completed + 1;
          } else {
            chartObject.pending = chartObject.pending + 1;
          }
        }

        chartObject.completedInPer=(chartObject.completed/(chartObject.pending+chartObject.completed))*100 ?(chartObject.completed/(chartObject.pending+chartObject.completed))*100: 0

      });
    });
    return finalData;
  }

  function returnUniqueValuesWithLatestUpdateTime(inputData){

    inputData.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);

    return inputData
  }
  module.exports={getMonthRange,parseActionDataForChart,returnUniqueValuesWithLatestUpdateTime}
