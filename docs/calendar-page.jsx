function render() {
  var self = this;
  var year = 2023;
  var month = 2;
  var monthStr = month < 10 ? '0' + month : '' + month;
  
  var regions = ['华北(含北京)', '东北', '华中华南', '华东(含上海)', '西部(西南西北)', '港澳', '海外其他'];
  var installTypes = [
    { name: '活动安装', color: '#FF4D4F', key: 'activity' },
    { name: '橱窗安装', color: '#FAAD14', key: 'window' },
    { name: '画图安装', color: '#91D5FF', key: 'drawing' },
    { name: '待定安装', color: '#C9CDD4', key: 'pending' },
  ];
  
  function getMonthDays(y, m) { return new Date(y, m, 0).getDate(); }
  function formatDate(y, m, d) {
    var yy = y;
    var mm = m < 10 ? '0' + m : '' + m;
    var dd = d < 10 ? '0' + d : '' + d;
    return yy + '-' + mm + '-' + dd;
  }
  function getWeekDay(dateStr) {
    var date = new Date(dateStr);
    var days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  }
  
  var mockData = {};
  if (month === 2 && year === 2023) {
    mockData['2023-02-14'] = [
      { region: '华北(含北京)', content: 'MONCLER-北京三里屯-橱窗(70周年橱窗拆除)-杭州门店-活动', type: 'activity' }
    ];
    mockData['2023-02-15'] = [
      { region: '华东(含上海)', content: 'GUCCI-上海国金-橱窗安装', type: 'window' }
    ];
  }
  
  var daysInMonth = getMonthDays(year, month);
  var calendarData = [];
  var stats = { total: 0, activity: 0, window: 0, drawing: 0, pending: 0 };
  
  for (var day = 1; day <= daysInMonth; day++) {
    var dateStr = formatDate(year, month, day);
    var tasks = mockData[dateStr] || [];
    calendarData.push({
      day: day,
      dateStr: dateStr,
      weekDay: getWeekDay(dateStr),
      tasks: tasks
    });
    for (var j = 0; j < tasks.length; j++) {
      stats.total++;
      var t = tasks[j].type;
      if (t === 'activity') stats.activity++;
      else if (t === 'window') stats.window++;
      else if (t === 'drawing') stats.drawing++;
      else stats.pending++;
    }
  }
  
  var colors = {
    primary: '#1677FF',
    primaryHover: '#4096FF',
    text: '#1D2129',
    textSecondary: '#4E5969',
    textTertiary: '#86909C',
    border: '#E5E6EB',
    borderLight: '#F2F3F5',
    bg: '#F7F8FA',
    bgCard: '#FFFFFF',
    success: '#52C41A',
  };
  
  var typeColors = {
    activity: { bg: '#FFF2F0', border: '#FFCCC7', text: '#FF4D4F' },
    window: { bg: '#FFFBE6', border: '#FFE58F', text: '#FAAD14' },
    drawing: { bg: '#E6F4FF', border: '#91CAFF', text: '#1677FF' },
    pending: { bg: '#F2F3F5', border: '#E5E6EB', text: '#86909C' },
  };
  
  function getTypeStyle(type) {
    var c = typeColors[type] || typeColors.pending;
    return {
      background: c.bg,
      border: '1px solid ' + c.border,
      color: c.text,
      padding: '4px 6px',
      borderRadius: '6px',
      fontSize: '11px',
      marginBottom: '4px',
      cursor: 'pointer',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    };
  }
  
  var styles = {
    page: {
      minHeight: '100vh',
      background: colors.bg,
      padding: '20px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      fontSize: '14px',
      color: colors.text,
      boxSizing: 'border-box',
    },
    card: {
      background: colors.bgCard,
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid ' + colors.borderLight,
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    title: {
      fontSize: '22px',
      fontWeight: 600,
      color: colors.text,
      margin: 0,
    },
    monthNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: colors.bg,
      padding: '4px',
      borderRadius: '8px',
    },
    monthBtn: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '6px',
      background: colors.bgCard,
      cursor: 'pointer',
      fontSize: '16px',
      color: colors.textSecondary,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'all 0.2s',
    },
    monthLabel: {
      fontSize: '16px',
      fontWeight: 600,
      minWidth: '100px',
      textAlign: 'center',
      color: colors.text,
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    select: {
      height: '36px',
      padding: '0 14px',
      border: '1px solid ' + colors.border,
      borderRadius: '8px',
      background: colors.bgCard,
      fontSize: '14px',
      color: colors.text,
      minWidth: '130px',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    dateInput: {
      height: '36px',
      padding: '0 14px',
      border: '1px solid ' + colors.border,
      borderRadius: '8px',
      background: colors.bgCard,
      fontSize: '14px',
      color: colors.text,
      minWidth: '150px',
      outline: 'none',
    },
    queryBtn: {
      height: '36px',
      padding: '0 28px',
      background: colors.primary,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(22,119,255,0.3)',
      transition: 'all 0.2s',
    },
    statsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #f0f5ff 0%, #fafbff 100%)',
      borderBottom: '1px solid ' + colors.borderLight,
      flexWrap: 'wrap',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
    },
    statTotal: {
      fontWeight: 600,
      color: colors.text,
      fontSize: '15px',
    },
    statLegend: {
      width: '14px',
      height: '14px',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    calendarTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    th: {
      padding: '14px 10px',
      background: '#FAFBFC',
      border: '1px solid ' + colors.borderLight,
      textAlign: 'center',
      fontWeight: 600,
      color: colors.textSecondary,
      fontSize: '13px',
    },
    td: {
      padding: '10px',
      border: '1px solid ' + colors.borderLight,
      verticalAlign: 'top',
      minHeight: '80px',
      background: colors.bgCard,
    },
    dateCell: {
      background: '#FAFBFC',
      fontWeight: 500,
      width: '110px',
      whiteSpace: 'nowrap',
      fontSize: '13px',
    },
    dayNum: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '2px',
    },
    weekDay: {
      fontSize: '11px',
      color: colors.textTertiary,
    },
    emptyCell: {
      height: '70px',
      color: colors.textTertiary,
      fontSize: '12px',
      textAlign: 'center',
      lineHeight: '70px',
    },
  };
  
  return (
    React.createElement('div', { style: styles.page },
      React.createElement('div', { style: styles.card },
        React.createElement('div', { style: styles.header },
          React.createElement('div', { style: styles.titleRow },
            React.createElement('h1', { style: styles.title }, '安装日历'),
            React.createElement('div', { style: styles.monthNav },
              React.createElement('button', { style: styles.monthBtn }, '‹'),
              React.createElement('span', { style: styles.monthLabel }, year + '年' + monthStr + '月'),
              React.createElement('button', { style: styles.monthBtn }, '›')
            )
          ),
          React.createElement('div', { style: styles.filterRow },
            React.createElement('select', { style: styles.select },
              React.createElement('option', { value: '' }, '全部区域'),
              regions.map(function(r, i) {
                return React.createElement('option', { key: i, value: r }, r);
              })
            ),
            React.createElement('select', { style: styles.select },
              React.createElement('option', { value: '' }, '全部类型'),
              installTypes.map(function(t, i) {
                return React.createElement('option', { key: i, value: t.key }, t.name);
              })
            ),
            React.createElement('input', { type: 'date', style: styles.dateInput }),
            React.createElement('input', { type: 'date', style: styles.dateInput }),
            React.createElement('button', { style: styles.queryBtn }, '查询')
          )
        ),
        React.createElement('div', { style: styles.statsBar },
          React.createElement('span', { style: styles.statItem },
            React.createElement('span', { style: styles.statTotal }, '总数量: ' + stats.total + '个')
          ),
          installTypes.map(function(t, i) {
            var count = i === 0 ? stats.activity : i === 1 ? stats.window : i === 2 ? stats.drawing : stats.pending;
            return React.createElement('span', { key: i, style: styles.statItem },
              React.createElement('span', { style: { ...styles.statLegend, background: t.color } }),
              t.name + ': ' + count + '个'
            );
          })
        ),
        React.createElement('table', { style: styles.calendarTable },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { style: { ...styles.th, ...styles.dateCell } }, '日期'),
              regions.map(function(r, i) {
                return React.createElement('th', { key: i, style: styles.th }, r);
              })
            )
          ),
          React.createElement('tbody', null,
            calendarData.map(function(row, rowIdx) {
              var tasksByRegion = {};
              for (var i = 0; i < row.tasks.length; i++) {
                var task = row.tasks[i];
                if (!tasksByRegion[task.region]) { tasksByRegion[task.region] = []; }
                tasksByRegion[task.region].push(task);
              }
              return React.createElement('tr', { key: rowIdx },
                React.createElement('td', { style: { ...styles.td, ...styles.dateCell } },
                  React.createElement('div', { style: styles.weekDay }, row.weekDay),
                  React.createElement('div', { style: styles.dayNum }, row.day)
                ),
                regions.map(function(r, colIdx) {
                  var regionTasks = tasksByRegion[r] || [];
                  return React.createElement('td', { key: colIdx, style: styles.td },
                    regionTasks.length > 0 ? regionTasks.map(function(task, idx) {
                      return React.createElement('div', {
                        key: idx,
                        style: getTypeStyle(task.type)
                      }, task.content);
                    }) : React.createElement('div', { style: styles.emptyCell }, '-')
                  );
                })
              );
            })
          )
        )
      )
    )
  );
}
