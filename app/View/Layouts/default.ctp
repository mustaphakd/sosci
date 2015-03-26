<!DOCTYPE html>
<html>
    <head>

        <?php echo $this->fetch('appHeader'); ?>


    </head>
    <body ng-controller="mainAppController">
        <?php
                echo $this->fetch('content');
        ?>
    </body>
</html>
