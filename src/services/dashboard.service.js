const Task = require('../models/Task');
const Client = require('../models/Client');
const Finance = require('../models/Finance');
const {startOfMonth, endOfMonth, startOfWeek, endOfWeek} = require('date-fns');

exports.getDashboardStats = async (userId) => {
    const today = new Date();

    //fechas clave para los filtros
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

    //ejecuto las consultas en paralelo para mejorar el rendimiento 
    const [
        totalClients,
        activeClients,
        pendingTasks,
        completedTasks,
        finances
    ] = await Promise.all([
        Client.countDocuments({owner: userId}),
        Client.countDocuments({owner: userId, active: true}),
        Task.countDocuments({owner: userId, status: {$ne: 'completed'} }),
        Task.countDocuments({owner: userId, status: 'completed', updatedAt: {$gte: startMonth, $lte: endMonth} }),
        Finance.find({
            owner: userId,
            date: {$gte: startMonth, $lte: endMonth}
        })
    ]);

    //calculo el dinero de cada usuario
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    finances.forEach(mov => {
        if(mov.type === 'ingreso') monthlyIncome += mov.amount;
        if(mov.type === 'gasto') monthlyExpenses += mov.amount;
    });

    const netProfit = monthlyIncome - monthlyExpenses;

    //calculo el presupuesto de tareas pendientes, asi el usuario puede ver todo lo que le puede generar 
    const tasksInProgress = await Task.find({owner: userId, status: {$ne: 'completed'} });
    const moneyAtStake = tasksInProgress.reduce((acc, task) => acc + (task.budget || 0), 0);

    return {
        kpis: {
            netProfit, //beneficio neto al mes 
            monthlyIncome, // Ingreso al mes
            monthlyExpenses, // gastos al mes 
            moneyAtStake, // presupuesto de tareas pendientes 
            activeClients, //clientes activos
            totalClients, //total de clientes
            pendingTasks, //tareas pendientes
            completedTasks // tareas completadas del mes
        }
    };
};