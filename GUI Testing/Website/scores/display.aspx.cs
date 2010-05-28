using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using MySql.Data.Types;

namespace unity1.scores
{
    public partial class display : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string strCon = "Data Source=localhost;Database=unity1;User Id=root;Password=password;";
            MySqlConnection mysqlCon = new MySqlConnection(strCon);

            mysqlCon.Open();

            string strSQL = "SELECT * FROM `scores` ORDER by `id` DESC LIMIT 5";

            MySqlCommand mysqlCmd = new MySqlCommand(strSQL, mysqlCon);

            MySqlDataReader rdrScores = mysqlCmd.ExecuteReader();
            while (rdrScores.Read())
            {
                Response.Write(rdrScores.GetString(0) + "\t" + rdrScores.GetString(1) + "\t" + rdrScores.GetString(2) + " \n");
            } 


            mysqlCon.Close();

        }
    }
}